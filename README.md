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
![upslist](https://cloud.githubusercontent.com/assets/7579267/8732246/a56e465a-2c15-11e5-89b3-f3c413c539e4.png)

Send command to UPS
![commands](https://cloud.githubusercontent.com/assets/7579267/8732245/a54996e8-2c15-11e5-9584-d46206fea604.png)

Change Log
==========
v1.0 - July 16, 2015
--------------------
 * Initialize repository version 1.0

License
=======
NutUI is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
