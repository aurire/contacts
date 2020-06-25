#!/bin/bash

npm run build
echo '----------------------------------';
echo 'Copying frontend files to symfony';
echo '----------------------------------';
cp -avr ./build/. ../symfony/public/
cp -av ./build/index.html ../symfony/templates/base.html.twig
echo 'DONE!'
