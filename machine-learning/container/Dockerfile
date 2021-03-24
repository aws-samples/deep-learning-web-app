FROM python:3.6

RUN apt-get -y update && apt-get install -y --no-install-recommends \
         wget \
         python \
         nginx \
         ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install all of the packages
RUN wget https://bootstrap.pypa.io/get-pip.py && python get-pip.py

# install code dependencies
COPY "requirements.txt" .
RUN ["pip", "install", "-r", "requirements.txt"]

RUN pip list
# Env Variables
ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/ml:${PATH}"

# Set up the program in the image
COPY scripts /opt/ml
WORKDIR /opt/ml



# Main Libraries used:

# RUN pip install numpy
# RUN pip install scipy
# RUN pip install scikit-learn
# RUN pip install pandas
# RUN pip install flask
# RUN pip install gevent
# RUN pip install gunicorn
# RUN pip install tensorflow==1.15.2
# RUN pip install keras==2.2.4
# RUN pip install h5py
# RUN pip install hyperopt
