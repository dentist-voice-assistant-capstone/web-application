# Backend API for Dentist Web Application
## Description
This folder contains code (Python) for running an backend ner API for token classification and parser model.
## Install
For the installation, you need to run the following command in your terminal
```sh
# First step, create an environment
conda create --name ner_backend python=3.9

# Second step, activate environment
conda activate ner_backend

# Third step, install libraries
pip install -r requirements.txt
```
After finishing, please load weight of wangchanberta through this [link]([https://drive.google.com/file/d/1-H4koEFhtAOt1f1y17N0e8MxDCci37Mz/view?usp=share_link](https://drive.google.com/file/d/15xjAegzT-AWGlyqgguPssP_tu7-0CQw6/view?usp=drive_link) and move it to model folder

## Running server
For running the server, you can run the following command
```sh
# Activate environment
conda activate ner_backend

# Start server
python server.py
```
In addition, you can change the running port by changing the PORT variable in config.py (default port = 50052)
