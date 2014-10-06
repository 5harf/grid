describe('decorators', function () {
    var core = require('@grid/grid-spec-helper')();
    var decorators;
    var grid;
    beforeEach(function () {
        grid = core.buildSimpleGrid();
        decorators = grid.decorators;
        //clear any other decorators
        decorators.remove(grid.decorators.getAlive());
        decorators.popAllDead();
        spyOn(grid, 'requestDraw'); //mock the method to prevent draw
        core.resetAllDirties(); //set everything clean to start
    });

    describe('should create decorators', function () {
        var decorator;
        beforeEach(function () {
            decorator = decorators.create();
        });

        it('with the right defaults', function () {
            expect(decorator.render).toBeAFunction();
        });

        describe('that satisify', function () {
            require('@grid/position-range/test-body')(function () {
                return {
                    range: decorator,
                    core: core,
                    parent: decorators
                };
            });
        });
    });


    it('should let me add a decorator and request draw', function () {
        var dec = decorators.create();
        core.resetAllDirties();
        expect(decorators.isDirty()).toBe(false);
        decorators.add(dec);
        expect(decorators.isDirty()).toBe(true);
        expect(decorators.getAlive()[0]).toEqual(dec);
    });

    it('should let me remove a decorator', function () {
        var dec = decorators.create();
        core.resetAllDirties();
        expect(decorators.isDirty()).toBe(false);
        decorators.add(dec);
        core.resetAllDirties();
        expect(decorators.isDirty()).toBe(false);
        decorators.remove(dec);
        expect(decorators.isDirty()).toBe(true);
        expect(decorators.getAlive()).toEqual([]);
        expect(decorators.popAllDead()).toEqual([dec]);
    });

    it('should let me remove multiple decorators', function () {

        var dec2 = decorators.create();
        var dec1 = decorators.create();
        decorators.add(dec1);
        decorators.add(dec2);
        decorators.remove([dec1, dec2]);
        expect(decorators.getAlive()).toEqual([]);
        expect(decorators.popAllDead()).toEqual([dec1, dec2]);
    });

    it('should give me alive and dead decorators and all', function () {
        var dec = decorators.create();
        decorators.add(dec);
        var dec2 = decorators.create();
        decorators.add(dec2);
        decorators.remove(dec);
        expect(decorators.getAlive()).toEqual([dec2]);
        expect(decorators.popAllDead()).toEqual([dec]);
        expect(decorators.popAllDead()).toEqual([]);

    });

});