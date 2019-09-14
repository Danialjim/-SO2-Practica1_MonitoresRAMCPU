Sistemas Operativos 2
Carlos Daniel Alonzo Jimenez
201313982
Practica 1

Comandos para subir los modulos al kernel:

Modulo del CPU
make -C /lib/modules/$(uname -r)/build M=$PWD modules
sudo insmod ModuloCPUSopes11.ko
sudo rmmod ModuloCPUSopes11

Modulo de la RAM
make -C /lib/modules/$(uname -r)/build M=$PWD modules
sudo insmod ModuloMemoriaSopes1.ko
sudo rmmod ModuloMemoriaSopes1

Para correr la aplicacion web:
node app.js
