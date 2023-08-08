FROM python:3.8
ENV DockerHome=/home/src/app
WORKDIR $DockerHome
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
#ENV SECRET_KEY=$SECRET_KEY
RUN apt-get update && apt-get install -y libpq-dev awscli
RUN pip install --upgrade pip
RUN wget https://ttkeys-prod.s3.eu-west-1.amazonaws.com/ttkeys-v0.0.1.tar
RUN tar -xvf ttkeys-v0.0.1.tar
RUN mv ttkeys /usr/bin/ttkeys
COPY . $DockerHome
RUN pip install -r requirements.txt
EXPOSE 8000
# Run Migrations as this not not execute in on docker
RUN chmod +x /home/src/app/run.sh
ENTRYPOINT ["/home/src/app/run.sh"]

#CMD ["ttkeys", "python", "manage.py", "runserver", "0.0.0.0:8000"]