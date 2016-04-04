/**
 * Network UPS Tools UI Bootstrap.
 *
 * @author demorfi <demorfi@gmail.com>
 * @version 1.0
 * @source https://github.com/demorfi/nutui
 * @license http://opensource.org/licenses/MIT Licensed under MIT License
 */

var app = angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap']);

app.service('DeviceService', [
    '$http', function ($http)
    {
        this.getDevices = function (params)
        {
            return $http({
                method      : 'GET',
                url         : '/cgi-bin/nut/upsstats.cgi',
                responseType: 'document',
                params      : params
            });
        };

        this.sendForm = function (data)
        {
            return $http({
                method          : 'POST',
                url             : '/cgi-bin/nut/upsset.cgi',
                responseType    : 'document',
                data            : data,
                headers         : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj)
                {
                    var data = [];
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            data.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
                        }
                    }
                    return (data.join('&'));
                }
            });
        };
    }
]);

app.controller('DevicesCtrl', [
    '$scope', '$interval', '$q', 'DeviceService', function ($scope, $interval, $q, DeviceService)
    {
        $scope.refresh = false;
        $scope.$watch('refresh', function ()
        {
            var devices;
            DeviceService.getDevices().then(function (response)
            {
                var keyList = [
                    'system',
                    'model',
                    'status',
                    'battery',
                    'input_vac',
                    'output_vac',
                    'load',
                    'temp',
                    'runtime'
                ];

                // find device items
                devices = angular.element(response.data).find('table table tr[align="CENTER"]').map(function ()
                {
                    var item = {};
                    item.host = $(this).find('td').each(function (index)
                    {
                        if (index in keyList) {
                            var value = $.trim($(this).text().replace(/\n/g, ''));
                            item[keyList[index]] = value ? value : '-';
                        }
                    }).first().children('a').get(0).search.replace('?host=', '');
                    return (item);
                }).get();

                // fetch all data devices
                var devicesHosts = [];
                angular.forEach(devices, function (device)
                {
                    this.push(DeviceService.getDevices({
                        host    : device.host,
                        treemode: true
                    }));
                }, devicesHosts);

                return ($q.all(devicesHosts));
            }).then(function (responses)
            {
                angular.forEach(responses, function (response, key)
                {
                    var data = {
                        list: [],
                        keys: {}
                    };

                    angular.element(response.data).find('table table tr[align="LEFT"]').each(function ()
                    {
                        var value = $.trim($(this).find('td:last').text()),
                            item  = {
                                key  : $.trim($(this).find('td:first').text()),
                                value: value ? value : '-'
                            };

                        data.keys[item.key.replace(/\./g, '_')] = item.value;
                        data.list.push(item);
                    });

                    this[key].data = data;
                }, devices);

                $scope.devices = devices;
            });
        });

        $scope.toggleCollapse = function ()
        {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // refresh view
        $interval(function ()
        {
            $scope.refresh = !$scope.refresh;
        }, 8000);
    }
]);

app.controller('ProgressCtrl', [
    '$scope', function ($scope)
    {
        /** @namespace $scope.device.data.keys.battery_charge_low Battery level low charge */
        var low = parseInt($scope.device.data.keys.battery_charge_low) || 10;

        /** @namespace $scope.device.data.keys.battery_charge_warning Battery level warning charge */
        var warning = parseInt($scope.device.data.keys.battery_charge_warning) || 30;

        /** @namespace $scope.device.battery Battery level charge */
        var percent = parseInt($scope.device.battery) || 0,
            charge  = (low + warning);

        $scope.cells = [
            {
                type    : 'danger', // width 10%
                percent : percent < 1 ? 0 : (percent < low ? percent : low),
                isActive: percent < low && percent > 0
            },
            {
                type    : 'warning', // width 30%
                percent : percent < low ? 0 : (percent < charge ? percent - low : warning),
                isActive: percent < charge && percent > low
            },
            {
                type    : 'success', // width 60%
                percent : percent < charge ? 0 : percent - charge,
                isActive: percent < 99 && percent > charge
            }
        ];
    }
]);

app.controller('DeviceLoginCtrl', [
    '$scope', '$modal', 'DeviceService', function ($scope, $modal, DeviceService)
    {
        $scope.login = function ()
        {
            /** @namespace $scope.user User login form */
            DeviceService.sendForm($scope.user)
                .then(function (response)
                {
                    $scope.devices = angular.element(response.data).find('select[name="monups"] option')
                        .map(function ()
                        {
                            return ({
                                system: $.trim($(this).text()),
                                host  : $(this).val()
                            });
                        }).get();

                    $modal.open({
                        scope      : $scope,
                        animation  : true,
                        templateUrl: 'deviceSetting.html',
                        controller : 'DeviceSettingCtrl'
                    });
                });
        };
    }
]);

app.controller('DeviceSettingCtrl', [
    '$scope', '$modalInstance', 'DeviceService', function ($scope, $modalInstance, DeviceService)
    {
        $scope.title = 'Select UPS';

        $scope.tabSelect = function ()
        {
            // define of used function
            angular.forEach(this.$parent.tabs, function (tab)
            {
                if (tab.active) {
                    switch (tab.heading) {
                        case('Commands'):
                            $scope.useFunction = 'docmd';
                            break;
                        default:
                            $scope.useFunction = 'savesettings';
                    }
                }
            });
        };

        $scope.closeAlert = function (index)
        {
            $scope.alerts.splice(index, 1);
        };

        $scope.modalClose = function ()
        {
            $modalInstance.dismiss('close');
        };

        $scope.fetch = function ()
        {
            // visible active ups
            angular.forEach($scope.devices, function (device)
            {
                /** @namespace $scope.user.monups Selected ups host */
                if (device.host == $scope.user.monups) {
                    $scope.title = device.system;
                }
            });

            // fetch settings ups
            DeviceService.sendForm(angular.extend({}, $scope.user, {function: 'showsettings'}))
                .then(function (response)
                {
                    $scope.settings = angular.element(response.data).find('table table tr[align="CENTER"]')
                        .map(function ()
                        {
                            var setting = $(this).find('td:last input[type="TEXT"]');
                            return ({
                                key  : setting.attr('name'),
                                name : $.trim($(this).find('td:first').text()),
                                value: setting.val()
                            });
                        }).get();
                });

            // fetch commands ups
            DeviceService.sendForm(angular.extend({}, $scope.user, {function: 'showcmds'}))
                .then(function (response)
                {
                    $scope.commands = angular.element(response.data).find('[name="upscommand"] option[value!=""]')
                        .map(function ()
                        {
                            return ({
                                var : $(this).val(),
                                name: $.trim($.trim($(this).text()))
                            });
                        }).get();
                });
        };

        // update data ups
        $scope.sendData = function ()
        {
            /** @namespace $scope.user.upscommand Selected ups command */
            if ($scope.useFunction != 'docmd' || $scope.user.upscommand) {
                var data = angular.extend({}, $scope.user, {function: $scope.useFunction});

                // append fields settings
                angular.forEach(angular.copy($scope.settings), function (setting)
                {
                    data[setting.key] = setting.value;
                });

                DeviceService.sendForm(data).then(function (response)
                {
                    var message = angular.element(response.data).find('table table pre').text();
                    $scope.alerts = [
                        {
                            msg : message,
                            type: message.indexOf('OK') !== -1 ? 'success' : 'danger'
                        }
                    ];
                });
            }
        };


    }
]);
