# NutUI
-------
Network UPS Tools UI Bootstrap.

Required
========
* Network UPS Tools (Web) >= 2.7
* Access to pages `/cgi-bin/nut/upsstats.cgi` and `/cgi-bin/nut/upsset.cgi`

Pre-Requirements
========
* Git
* Composer

Features
========
* Landing page
* Cross browser support (IE, Chrome, Firefox, Opera, Vivaldi)
* Async reload info
* Easy install

Install
=====
* Change into web nut directory: `cd /usr/local/www/nut`
* Clone repository: `git clone https://github.com/demorfi/nutui.git nutui && cd nutui`
* Install composer dependencies: `composer install`
* Add a vhost with `/nut/nutui/web` as DocumentRoot or Alias.

Screenshots
===========
Active UPS list
![upslist](https://cloud.githubusercontent.com/assets/7579267/8759661/0bd73bc4-2d13-11e5-8d7c-bb158566e3c9.png)

Send command to UPS
![commands](https://cloud.githubusercontent.com/assets/7579267/8759660/0bd5d220-2d13-11e5-9e26-876d5b5ba051.png)

Change Log
==========
v1.0 - July 16, 2015
--------------------
 * Initialize repository version 1.0

License
=======
NutUI is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
