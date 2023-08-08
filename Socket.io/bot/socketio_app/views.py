import os
import json
import logging
import socketio
from datetime import datetime, time
from django.conf import settings
from django.http import JsonResponse

async_mode = "eventlet"


basedir = os.path.dirname(os.path.realpath(__file__))
sio = socketio.Server(async_mode=async_mode, cors_allowed_origins="*")
thread = None


def index(request):
    global thread
    if thread is None:
        thread = sio.start_background_task(background_thread)
    return JsonResponse({"message": "conected"})


def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        sio.sleep(10)
        count += 1
        sio.emit('my_response', {'data': 'Server generated event'},
                 namespace='/test')


@sio.event
def disconnect_request(sid, message):
    sio.disconnect(sid)



# Get an instance of a logger
logger = logging.getLogger(__name__)

def detect_intent_texts(project_id, session_id, texts, language_code):
    """Returns the result of detect intent with texts as inputs.

    Using the same `session_id` between requests allows continuation
    of the conversation."""
    from google.cloud import dialogflow

    session_client = dialogflow.SessionsClient()

    session = session_client.session_path(project_id, session_id)

    for text in texts:
        text_input = dialogflow.TextInput(
            text=text, language_code=language_code
        )

        query_input = dialogflow.QueryInput(text=text_input)

        response = session_client.detect_intent(
            request={"session": session, "query_input": query_input}
        )



        logger.debug("Query text: {}".format(response.query_result.query_text))
        logger.debug(
            "Detected intent: {} (confidence: {})\n".format(
                response.query_result.intent.display_name,
                response.query_result.intent_detection_confidence,
            )
        )
        logger.debug(
            "Fulfillment text: {}\n".format(
                response.query_result.fulfillment_text
            )
        )
    return response.query_result


@sio.event
def web_message(sid, message):

    results = detect_intent_texts(
        project_id=settings.DIALOGFLOW_PROJECT_ID,
        session_id=str(message["session_id"]),
        language_code="en-US",
        texts=[message["text"]],
    ) 
    text = ""
    for mes in results.fulfillment_messages:
        temp = str(mes.text.text[0])
        text += temp + "\n"
    time_stamp = datetime.now()
    response = {
        "text": text,
        "time_stamp": str(time_stamp)
    }
    sio.emit('bot_response',response, broadcast=False, to=sid)


@sio.event
def connect(sid, environ):
    sio.emit('connection_triggered', {'data': "connected to server"})


@sio.event
def disconnect(sid):
    sio.emit('disconnection_triggered', {'data': "disconnected from server"})
