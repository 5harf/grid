var util = require('@grid/util');
var makeDirtyClean = require('@grid/dirty-clean');

module.exports = function (_grid) {
    var grid = _grid;

    var dirtyClean = makeDirtyClean(grid);

    var aliveDecorators = [];
    var deadDecorators = [];

    var api = {
        add: function (decorator) {
            aliveDecorators.push(decorator);
            dirtyClean.setDirty();
        },
        remove: function (decorators) {
            if (!util.isArray(decorators)) {
                decorators = [decorators];
            }
            decorators.forEach(function (decorator) {
                aliveDecorators.splice(aliveDecorators.indexOf(decorator), 1);
                deadDecorators.push(decorator);
                dirtyClean.setDirty();
            });

        },
        getAlive: function () {
            return aliveDecorators;
        },
        popAllDead: function () {
            return deadDecorators;
        },
        isDirty: dirtyClean.isDirty,
        create: function () {
            var decorator = {};
            var thisDirtyClean = makeDirtyClean(grid);
            decorator.isDirty = thisDirtyClean.isDirty;

            var watchedProperties = ['top', 'left', 'bottom', 'right', 'units', 'space'];
            watchedProperties.forEach(function (prop) {
                var val;
                Object.defineProperty(decorator, prop, {
                    enumerable: true,
                    get: function () {
                        return val;
                    }, set: function (_val) {
                        if (_val !== val) {
                            dirtyClean.setDirty();
                            thisDirtyClean.setDirty();
                        }
                        val = _val;
                    }
                });
            });
            //defaults
            decorator.units = 'cell';
            decorator.space = 'virtual';
            return decorator;

        }

    };


    return api;
};