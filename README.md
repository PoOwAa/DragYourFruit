# DragYourFruit
Test website for GSoC2016 (syslog-ng)

## About
It's a small project by syslog-ng for Google Summer of Code 2016. This is the description:

Create a webpage. On this webpage the user can add fruits and they 
can move the position of the fruits by drag & drop. The properties 
of the fruits are editable using right­click menu. 
The fruits and its properties are come from a yaml file. Adding 
new property or new fruit is would be possible without code 
modification, only editing the yaml file.

## Dependencies
Django 1.9

## Usage
In DragYourFruit folder type:
python manage.py runserver

After that you can check on your localhost (127.0.0.1:8000)

Drag your yaml file to the box ("Drop file here"). The fruit menu will appear. Click on a fruit and it will appear on the canvas. With right click you can customize the properties of fruits. Drag them anywhere in the canvas!
