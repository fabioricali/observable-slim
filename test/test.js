let chai = require('chai');
let expect = chai.expect;
let assert = chai.assert;
let ObservableSlim = require("../src/observable-slim.js");
global.NativeProxy = global.Proxy;
global.Proxy = undefined;
require("../proxy.js");
global.PolyfillProxy = global.Proxy;

/*
describe('Native Proxy', function () {
    suite(global.NativeProxy);
});
*/
/*
describe('ES5 Polyfill Proxy', function () {
    suite(global.PolyfillProxy);
});
*/

//function suite(proxy) {

describe('the test', function () {

    let test, p;

    beforeEach(() => {
        global.Proxy = global.NativeProxy;
        test = {};
        p = ObservableSlim.create(test, false, function (changes) {
            return null;
        });
    });

    it('1. Read 20,000 objects in under 1 second.', function () {

        this.timeout(1000);

        let largeArray = [];

        for (let i = 0; i < 20000; i++) {
            largeArray.push({
                "hello": "world"
                , "foo": "bar"
            });
        }

        let largeProxyArr = ObservableSlim.create(largeArray, false, function (changes) {
        });

        for (let i = 0; i < largeProxyArr.length; i++) {
            let test = largeProxyArr[i].foo;
        }

    });

    it('2. Write 20,000 objects in under 2 seconds.', function () {

        this.timeout(1000);

        let largeArray = [];

        for (let i = 0; i < 20000; i++) {
            largeArray.push({
                "hello": "world"
                , "foo": "bar"
            });
        }

        let largeProxyArr = ObservableSlim.create(largeArray, false, function (changes) {
        });

        for (let i = 0; i < largeProxyArr.length; i++) {
            largeProxyArr[i].foo = "BAR";
        }

    });

    it('3. Add a new string property (not supported with ES5 polyfill).', function () {
        if (global.Proxy === global.NativeProxy) {
            ObservableSlim.observe(p, function (changes) {
                expect(changes[0].type).to.equal("add");
                expect(changes[0].newValue).to.equal("world");
            });
            p.hello = "world";
            expect(p.hello).to.equal("world");
            expect(test.hello).to.equal("world");
        }
    });

    it('4. Modify string property value.', function () {
        let test = {"hello": ""};
        let p = ObservableSlim.create(test, false, function (changes) {
            expect(changes[0].type).to.equal("update");
            expect(changes[0].newValue).to.equal("WORLD");
        });

        p.hello = "WORLD";
        expect(p.hello).to.equal("WORLD");
        expect(test.hello).to.equal("WORLD");
    });

    it('5. Modify string property value with DOM delay included.', (done) => {
        let test = {"hello": ""};
        let p = ObservableSlim.create(test, true, function (changes) {
            expect(changes[0].type).to.equal("update");
            expect(changes[0].newValue).to.equal("WORLD");
        });

        p.hello = "WORLD";
        setTimeout(function () {
            expect(p.hello).to.equal("WORLD");
            expect(test.hello).to.equal("WORLD");
            done();
        }, 100);
    });

    it('6. Modify a deeply nested array item.', function () {
        let test = {"hello": {"testing": {"foo": ["testing", {"stuff": "hey"}, "here"]}}};
        let p = ObservableSlim.create(test, false, function (changes) {

            expect(changes[0].type).to.equal("update");
            expect(changes[0].newValue).to.equal("WORLD");
            expect(changes[0].currentPath).to.equal("hello.testing.foo.1.stuff");
            expect(changes[0].jsonPointer).to.equal("/hello/testing/foo/1/stuff");
        });

        p.hello.testing.foo[1].stuff = "WORLD";
        expect(p.hello.testing.foo[1].stuff).to.equal("WORLD");
        expect(test.hello.testing.foo[1].stuff).to.equal("WORLD");
    });

    it('7. Add a new object property (not supported with ES5 polyfill).', function () {
        if (global.Proxy === global.NativeProxy) {
            ObservableSlim.observe(p, function (changes) {
                expect(changes[0].type).to.equal("add");
                expect(changes[0].newValue).to.be.an.instanceof(Object);
            });
            p.testing = {};
            expect(p.testing).to.be.an.instanceof(Object);
            expect(test.testing).to.be.an.instanceof(Object);
        }
    });

    it('8. Set property equal to object.', function () {
        let test = {"testing": false};
        let p = ObservableSlim.create(test, false, function (changes) {
            expect(changes[0].type).to.equal("update");
            expect(changes[0].newValue).to.be.an.instanceof(Object);
        });
        p.testing = {};
        expect(p.testing).to.be.an.instanceof(Object);
        expect(test.testing).to.be.an.instanceof(Object);
    });

    it('9. Add a new nested number property (not supported with ES5 polyfill).', function () {
        if (global.Proxy === global.NativeProxy) {
            ObservableSlim.observe(p, function (changes) {
                expect(changes[0].type).to.equal("add");
                expect(changes[0].newValue).to.equal(42);
                expect(changes[0].currentPath).to.equal("testing.blah");
            });
            test.testing = {};
            p.testing.blah = 42;
            expect(p.testing.blah).to.be.equal(42);
            expect(test.testing.blah).to.be.equal(42);
        }
    });

    it('10. Update nested number property.', function () {
        let test = {};
        test.testing = {};
        test.testing.blah = 0;
        let p = ObservableSlim.create(test, false, function (changes) {
            expect(changes[0].type).to.equal("update");
            expect(changes[0].newValue).to.equal(42);
            expect(changes[0].currentPath).to.equal("testing.blah");
        });
        p.testing.blah = 42;
        expect(p.testing.blah).to.be.equal(42);
        expect(test.testing.blah).to.be.equal(42);
    });

    it('11. Set property as a new array.', function () {
        let test = {"arr": false};
        let p = ObservableSlim.create(test, false, function (changes) {
            expect(changes[0].type).to.equal("update");
            expect(changes[0].newValue).to.be.an.instanceof(Array);
        });
        p.arr = [];
        expect(p.arr).to.be.an.instanceof(Array);
        expect(test.arr).to.be.an.instanceof(Array);
    });

    it('12. Add a new array property (not supported with ES5 polyfill).', function () {
        if (global.Proxy === global.NativeProxy) {
            ObservableSlim.observe(p, function (changes) {
                expect(changes[0].type).to.equal("add");
                expect(changes[0].newValue).to.be.an.instanceof(Array);
            });
            p.arr = [];
            expect(p.arr).to.be.an.instanceof(Array);
            expect(test.arr).to.be.an.instanceof(Array);
        }
    });

    it('13. Push item on to an array.', function () {
        let test = {"arr": []};
        let change = 0;
        let p = ObservableSlim.create(test, false, function (changes) {
            if (change === 0) {
                expect(changes[0].type).to.equal("add");
                expect(changes[0].newValue).to.equal("hello world");
                expect(changes[0].currentPath).to.equal("arr.0");
                expect(changes[0].property).to.equal("0");
            } else if (change === 1) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].currentPath).to.equal("arr.length");
                expect(changes[0].property).to.equal("length");
                expect(changes[0].previousValue).to.equal(0);
                expect(changes[0].newValue).to.equal(1);
            }
            change++;
        });

        p.arr.push("hello world");
        expect(p.arr[0]).to.equal("hello world");
        expect(test.arr[0]).to.equal("hello world");
    });

    it('14. Unshift item to an array.', function () {
        let change = 0;
        let test = {"arr": ["foo bar"]};
        let p = ObservableSlim.create(test, false, function (changes) {
            if (change === 0) {
                expect(changes[0].type).to.equal("add");
                expect(changes[0].newValue).to.equal("foo bar");
                expect(changes[0].currentPath).to.equal("arr.1");
                expect(changes[0].property).to.equal("1");
            } else if (change === 1) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].newValue).to.equal("hello world");
                expect(changes[0].previousValue).to.equal("foo bar");
                expect(changes[0].currentPath).to.equal("arr.0");
                expect(changes[0].property).to.equal("0");
            }
            change++;
        });

        let length = p.arr.unshift("hello world");
        expect(p.arr[0]).to.equal("hello world");
        expect(test.arr[0]).to.equal("hello world");
        expect(p.arr.length).to.equal(2);
        expect(test.arr.length).to.equal(2);
        expect(length).to.equal(2);
    });

    it('15. Pop an item from an array.', function () {
        let change = 0;
        let test = {"arr": ["hello world", "foo bar"]};
        let p = ObservableSlim.create(test, false, function (changes) {
            if (change === 0) {
                expect(changes[0].type).to.equal("delete");
                expect(changes[0].property).to.equal("1");
                expect(changes[0].newValue).to.equal(null);
                expect(changes[0].previousValue).to.equal("foo bar");
                expect(changes[0].currentPath).to.equal("arr.1");

            } else if (change === 1) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].property).to.equal("length");
                expect(changes[0].newValue).to.equal(1);
                expect(changes[0].previousValue).to.equal(2);
                expect(changes[0].currentPath).to.equal("arr.length");
            }

            change++;
        });

        let lastItem = p.arr[1];
        let popItem = p.arr.pop();

        let popLastSame = (lastItem === popItem);

        expect(p.arr[0]).to.equal("hello world");
        expect(test.arr[0]).to.equal("hello world");
        expect(test.arr.length).to.equal(1);
        expect(p.arr.length).to.equal(1);
        expect(popLastSame).to.equal(true);
    });

    it('16. Splice first item from an array.', function () {
        let change = 0;
        let test = {};
        test.arr = [];
        test.arr.push("hello world");
        let p = ObservableSlim.create(test, false, function (changes) {
            if (change === 0) {
                firstChange = false;
                expect(changes[0].type).to.equal("delete");
                expect(changes[0].previousValue).to.equal("hello world");
            } else if (change === 0) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].property).to.equal("length");
            }
            change++;
        });
        p.arr.splice(0, 1);
        expect(test.arr.length).to.equal(0);
        expect(p.arr.length).to.equal(0);
    });

    it('17. Insert item into an array using splice.', function () {
        let change = 0;
        let test = {"arr": ["hello world", "foo bar", "sunday", "sunday"]};
        let p = ObservableSlim.create(test, false, function (changes) {
            if (change === 0) {
                expect(changes[0].type).to.equal("add");
                expect(changes[0].property).to.equal("4");
                expect(changes[0].newValue).to.equal("sunday");
                expect(changes[0].previousValue).to.equal(undefined);
                expect(changes[0].currentPath).to.equal("arr.4");
            } else if (change === 1) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].property).to.equal("2");
                expect(changes[0].newValue).to.equal("foo bar");
                expect(changes[0].previousValue).to.equal("sunday");
                expect(changes[0].currentPath).to.equal("arr.2");
            } else if (change === 2) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].property).to.equal("1");
                expect(changes[0].newValue).to.equal("inserting");
                expect(changes[0].previousValue).to.equal("foo bar");
                expect(changes[0].currentPath).to.equal("arr.1");
            }
            change++;
        });

        let val = p.arr.splice(1, 0, "inserting");

        expect(test.arr.length).to.equal(5);
        expect(p.arr.length).to.equal(5);
        expect(test.arr[1]).to.equal("inserting");
        expect(p.arr[1]).to.equal("inserting");
        expect(val.length).to.equal(0);
    });

    it('18. Insert new item and remove two items from an array using splice.', function () {
        let change = 0;
        let test = {"arr": ["hello world", "foo bar", "sunday", "tuesday"]};
        let p = ObservableSlim.create(test, false, function (changes) {
        });

        let val = p.arr.splice(1, 2, "inserting");

        expect(test.arr.length).to.equal(3);
        expect(p.arr.length).to.equal(3);
        expect(test.arr[1]).to.equal("inserting");
        expect(p.arr[1]).to.equal("inserting");
        expect(JSON.stringify(test.arr)).to.equal('["hello world","inserting","tuesday"]');
        expect(JSON.stringify(p.arr)).to.equal('["hello world","inserting","tuesday"]');
        expect(val.length).to.equal(2);
        expect(val[0]).to.equal("foo bar");
        expect(val[1]).to.equal("sunday");

    });

    it('19. Shift the first item off an array.', function () {
        let change = 0;
        let test = {"arr": ["foo bar", "hello world"]};
        let p = ObservableSlim.create(test, false, function (changes) {
            if (change === 0) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].property).to.equal("0");
                expect(changes[0].newValue).to.equal("hello world");
                expect(changes[0].previousValue).to.equal("foo bar");
                expect(changes[0].currentPath).to.equal("arr.0");

            } else if (change === 1) {
                expect(changes[0].type).to.equal("delete");
                expect(changes[0].property).to.equal("1");
                expect(changes[0].newValue).to.equal(null);
                expect(changes[0].previousValue).to.equal("hello world");
                expect(changes[0].currentPath).to.equal("arr.1");
            } else if (change === 2) {
                expect(changes[0].type).to.equal("update");
                expect(changes[0].property).to.equal("length");
                expect(changes[0].newValue).to.equal(1);
                expect(changes[0].previousValue).to.equal(2);
                expect(changes[0].currentPath).to.equal("arr.length");
            }
            change++;
        });

        let removedItem = p.arr.shift();
        expect(p.arr[0]).to.equal("hello world");
        expect(test.arr[0]).to.equal("hello world");
        expect(p.arr.length).to.equal(1);
        expect(test.arr.length).to.equal(1);
        expect(removedItem).to.equal("foo bar");
    });

    it('20. currentPath is updated correctly when the position of an Object in an Array changes.', function () {

        let change = 0;
        let test = [{}, {"foo": "test"}];
        let p = ObservableSlim.create(test, false, function (changes) {

            // the change events differ slightly when using the ES5 Proxy polyfill, so we skip that part of the validation
            // when the proxy is in use
            if (global.Proxy === global.NativeProxy) {
                if (change === 0) {
                    expect(changes[0].type).to.equal("update");
                    expect(changes[0].property).to.equal("0");
                    expect(changes[0].currentPath).to.equal("0");
                } else if (change === 1) {
                    expect(changes[0].type).to.equal("delete");
                    expect(changes[0].property).to.equal("1");
                    expect(changes[0].currentPath).to.equal("1");
                } else if (change === 2) {
                    expect(changes[0].type).to.equal("update");
                    expect(changes[0].property).to.equal("length");
                    expect(changes[0].newValue).to.equal(1);
                    expect(changes[0].previousValue).to.equal(2);
                    expect(changes[0].currentPath).to.equal("length");
                } else if (change === 3) {
                    expect(changes[0].type).to.equal("update");
                    expect(changes[0].property).to.equal("foo");
                    expect(changes[0].newValue).to.equal("bar");
                    expect(changes[0].previousValue).to.equal("test");
                    expect(changes[0].currentPath).to.equal("0.foo");
                }
            }

            change++;

        });

        p.splice(0, 1);
        p[0].foo = "bar";

        expect(test.length).to.equal(1);
        expect(test[0].foo).to.equal("bar");

    });


    it('21. Delete a property (not supported with ES5 polyfill).', function () {
        if (global.Proxy === global.NativeProxy) {
            ObservableSlim.create(test, function (changes) {
                expect(changes[0].type).to.equal("delete");
                expect(changes[0].property).to.equal("hello");
            });

            test.hello = "hello";
            delete p.hello;

            expect(test.hello).to.be.an('undefined');
            expect(p.hello).to.be.an('undefined');
        }
    });

    it('22. __isProxy check', function () {
        expect(p.__isProxy).to.be.equal(true);
    });

    it('23. __getTarget check', function () {
        let isSameObject = false;
        if (p.__getTarget === test) isSameObject = true;
        expect(isSameObject).to.be.equal(true);
    });

    it('24. __getParent on nested object (not supported with ES5 polyfill).', function () {
        if (global.Proxy === global.NativeProxy) {
            p.hello = {};
            p.hello.blah = {"found": "me"};
            test.hello.blah.foo = {};
            let target = p.hello.blah.foo;
            expect(target.__getParent().found).to.equal("me");
        }
    });

    it('25. Multiple observables on same object.', function () {
        let test = {"dummy": "blah"};
        let firstProxy = false;
        let secondProxy = false;
        let pp = ObservableSlim.create(test, false, function (changes) {
            if (changes[0].currentPath === "dummy" && changes[0].newValue === "foo") {
                firstProxy = true;
            }
        });
        let ppp = ObservableSlim.create(pp, false, function (changes) {
            if (changes[0].currentPath === "dummy" && changes[0].newValue === "foo") {
                secondProxy = true;
            }
        });

        ppp.dummy = "foo";

        expect(firstProxy).to.equal(true);
        expect(secondProxy).to.equal(true);
    });

    it('26. Multiple observables on same object with nested objects.', function () {
        let firstProxy = false;
        let secondProxy = false;
        let testing = {"foo": {"bar": "bar"}};
        let pp = ObservableSlim.create(testing, false, function (changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                firstProxy = true;
            }
        });
        let ppp = ObservableSlim.create(testing, false, function (changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                secondProxy = true;
            }
        });

        ppp.foo.bar = "foo";

        expect(firstProxy).to.equal(true);
        expect(secondProxy).to.equal(true);
    });

    it('27. Multiple observables on same object with nested objects by passing in a Proxy to `create`.', function () {
        let firstProxy = false;
        let secondProxy = false;
        let testing = {"foo": {"bar": "bar"}};
        let pp = ObservableSlim.create(testing, false, function (changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                firstProxy = true;
            }
        });
        let ppp = ObservableSlim.create(pp, false, function (changes) {
            if (changes[0].currentPath === "foo.bar" && changes[0].newValue === "foo") {
                secondProxy = true;
            }
        });

        ppp.foo.bar = "foo";

        expect(firstProxy).to.equal(true);
        expect(secondProxy).to.equal(true);
    });

    it('28. Multiple observables on same object and a Proxy nested within another object.', function () {

        let firstObservableTriggered = false;
        let secondObservableTriggered = false;
        let thirdObservableTriggered = false;

        let data = {"testing": {"test": {"testb": "hello world"}, "testc": "hello again"}, "blah": "tree"};
        let p = ObservableSlim.create(data, false, function (changes) {
            firstObservableTriggered = true;
        });
        let pp = ObservableSlim.create(p.testing, false, function (changes) {
            secondObservableTriggered = true;
        });

        let datatwo = {
            "hey": "world"
            , "other_data": p.testing
        };

        let ppp = ObservableSlim.create(datatwo, false, function (changes) {
            thirdObservableTriggered = true;
        });

        p.testing.test.testb = "YOOO";

        expect(firstObservableTriggered).to.equal(true);
        expect(secondObservableTriggered).to.equal(true);
        expect(thirdObservableTriggered).to.equal(true);

    });

    it.skip('29. Multiple observables on same object and a Proxy nested within another object set after initialization.', function () {

        let firstObservableTriggered = 0;
        let secondObservableTriggered = 0;
        let thirdObservableTriggered = 0;

        let data = {
            "testing": {"test": {"testb": "hello world"}, "testc": "hello again"},
            "blah": {"tree": "world"}
        };
        let p = ObservableSlim.create(data, false, function (changes) {
            firstObservableTriggered++;
        });
        let pp = ObservableSlim.create(p.testing, false, function (changes) {
            secondObservableTriggered++;
        });

        let datatwo = {
            "hey": "world"
            , "other_data": p.testing
            , "new_test": {}
        };

        let ppp = ObservableSlim.create(datatwo, false, function (changes) {
            thirdObservableTriggered++;
        });

        ppp.new_test = p.blah;

        p.blah.tree = "WORLD";

        expect(firstObservableTriggered).to.equal(1);
        expect(secondObservableTriggered).to.equal(0);
        expect(thirdObservableTriggered).to.equal(2);
        expect(p.blah.tree).to.equal("WORLD");
        expect(datatwo.new_test.tree).to.equal("WORLD");
        expect(ppp.new_test.tree).to.equal("WORLD");

    });

    it('30. Create an observable and then remove it.', function () {

        let observed = false;
        let data = {
            "testing": {"test": {"testb": "hello world"}, "testc": "hello again"},
            "blah": {"tree": "world"}
        };
        let p = ObservableSlim.create(data, false, function (changes) {
            observed = true;
        });

        // try removing a proxy that doesn't exist, ensure no errors
        ObservableSlim.remove({});

        ObservableSlim.remove(p);

        p.testing.test.testb = "HELLO WORLD";

        expect(observed).to.equal(false);

    });

    it('31. Verify that a mutation on an object observed by two handlers returns the correct new value in both handlers.', function () {

        let data = {"foo": "bar"};
        let p = ObservableSlim.create(data, false, function (changes) {
            expect(p.foo).to.equal("test");
        });

        let pp = ObservableSlim.create(p, false, function (changes) {
            expect(p.foo).to.equal("test");
        });

        p.foo = "test";
    });

    // When you overwrite a property that points to an object, Observable-Slim will perform a clean-up
    // process to stop watching objects that are no longer a child of the parent (top-most) observed object.
    // However, if a reference to the overwritten object exists somewhere else on the parent observed object, then we
    // still need to watch/observe that object for changes. This test verifies that even after the clean-up process (10 second delay)
    // changes to an overwritten object are still monitored as long as there's another reference to the object.
    it('32. Clean-up observers of overwritten (orphaned) objects.', (done) => {

        let data = {
            "testing": {"test": {"testb": "hello world"}, "testc": "hello again"},
            "blah": {"tree": "world"}
        };
        let dupe = {"duplicate": "is duplicated"};
        data.blah.dupe = dupe;
        data.dupe = dupe;
        let changeCnt = 0;

        let p = ObservableSlim.create(data, false, function (changes) {
            changeCnt++;
            if (changeCnt === 1) {
                expect(p.testing.test).to.be.an("undefined");
            } else if (changeCnt === 2) {
                expect(p.dupe).to.be.an("object");
                expect(p.dupe.duplicate).to.be.an("undefined");
            } else {
                expect(p.blah.dupe.duplicate).to.equal("should catch this change");
                done();
            }
        });

        p.testing = {};
        p.dupe = {};


        setTimeout(function () {
            p.blah.dupe.duplicate = "should catch this change";
        }, 10500);

    });

    it('33. JSON.stringify does not fail on proxied date.', function () {
        let test = {d: new Date()};
        let p = ObservableSlim.create(test, false, function () {
        });

        JSON.stringify(p);
    });

    it('34. valueOf does not fail on proxied date.', function () {
        let test = {d: new Date()};
        let p = ObservableSlim.create(test, false, function () {
        });

        p.d.valueOf();
    });

    it('35. Delete property after calling ObservableSlim.remove does not fail.', function () {
        let test = {foo: 'foo'};
        let p = ObservableSlim.create(test, false, function () {
        });

        ObservableSlim.remove(p);
        delete p.foo;
    });

    it('36. Proxied Date.toString outputs the pristine Date.toString.', function () {
        let test = {d: new Date()};
        let p = ObservableSlim.create(test, false, function () {
        });

        expect(p.d.toString()).to.equal(test.d.toString());
    });

    it('37. Proxied Date.getTime outputs the pristine Date.getTime.', function () {
        let test = {d: new Date()};
        let p = ObservableSlim.create(test, false, function () {
        });

        expect(p.d.getTime()).to.equal(test.d.getTime());
    });

    it('39. __targetPosition helper is non-enumerable.', function () {

        let found = false;

        let test = {d: new Date()};
        let p = ObservableSlim.create(test, false, function () {
        });

        for (let prop in test) {
            if (prop === "__targetPosition") found = true;
        }

        let keys = Object.keys(test);
        let i = keys.length;
        while (i--) {
            if (keys[i] === "__targetPosition") found = true;
        }

        expect(found).to.equal(false);

    });

    it('40. Before change, add a new string property.', function () {
        ObservableSlim.observe(p, function (changes) {
            expect(changes[0].type).to.equal("add");
            expect(changes[0].newValue).to.equal("world");
        });

        p.hello = "world";
        expect(p.hello).to.equal("world");
        expect(test.hello).to.equal("world");
    });

});
//}