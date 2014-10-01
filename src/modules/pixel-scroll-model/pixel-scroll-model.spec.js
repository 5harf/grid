describe('pixel-scroll-model', function () {

    var core = require('@grid/grid-spec-helper')();
    var model;
    var numRows = 100;
    var numCols = 10;
    var grid;

    beforeEach(function () {
        grid = core.buildSimpleGrid(numRows, numCols);
        model = grid.pixelScrollModel;
    });

    it('should have a top and left value that start at 0', function () {
        expect(model.top).toEqual(0);
        expect(model.left).toEqual(0);

    });

    it('should let you "scroll" to a pixel', function () {
        model.scrollTo(5, 6);
        expect(model.top).toEqual(5);
        expect(model.left).toEqual(6);
    });

    it('should let you set a scroll height and width', function () {
        model.setScrollSize(100, 200);
        expect(model.height).toEqual(100);
        expect(model.width).toEqual(200);
    });

    it('should not let you scroll below 0', function () {
        model.scrollTo(-5, 5);
        expect(model.top).toEqual(0);
        expect(model.left).toEqual(5);
        model.scrollTo(5, -5);
        expect(model.top).toEqual(5);
        expect(model.left).toEqual(0);
    });

    it('should not let you scroll above the current view', function () {
        model.setScrollSize(100, 200);
        grid.viewLayer.viewPort.width = 10;
        grid.viewLayer.viewPort.height = 5;

        model.scrollTo(1000, 10);
        expect(model.top).toEqual(95);
        expect(model.left).toEqual(10);

        model.scrollTo(10, 1000);
        expect(model.top).toEqual(10);
        expect(model.left).toEqual(190);
    });

    function sendMouseWheelToModel(y, x) {
        var event = require('@grid/custom-event')('mousewheel');
        event.deltaY = y;
        event.deltaX = x;
        event = require('@grid/mousewheel').normalize(event);
        model.handleMouseWheel(event);
        return event;
    }

    it('should handle a mousewheel event and offset the scroll accordingly', function () {
        //mock the event to look like our standardized one
        sendMouseWheelToModel(40, 30);
        expect(model.top).toEqual(40);
        expect(model.left).toEqual(30);

    });

    it('should call a scroll listener on scrollTo', function () {
        var spy = jasmine.createSpy();
        var unbind = grid.eventLoop.bind('grid-pixel-scroll', spy);
        model.scrollTo(5, 6);
        expect(spy).toHaveBeenCalled();
    });

    it('should not call a scroll listener synchronously on mousewheel', function () {
        var spy = jasmine.createSpy();
        var unbind = grid.eventLoop.bind('grid-pixel-scroll', spy);
        sendMouseWheelToModel(40, 30);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call a scroll listener asynchronously on mousewheel', function () {
        var spy = jasmine.createSpy();
        var unbind = grid.eventLoop.bind('grid-pixel-scroll', spy);
        sendMouseWheelToModel(40, 30);
        waits(10);
        runs(function () {
            expect(spy).toHaveBeenCalled();
        });
    });

    it('should prevent default on events', function () {
        var event = sendMouseWheelToModel(0, 0);
        expect(event.isDefaultPrevented()).toBe(true);
    });

    it('should set its width and height on creation', function () {
        expect(model.width).toBe(10 * 100);
        expect(model.height).toBe(100 * 30);
    });

});