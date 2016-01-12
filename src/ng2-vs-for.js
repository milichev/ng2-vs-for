System.register(['angular2/core', 'angular2/src/facade/async'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, async_1;
    var dde, matchingFunction, VsFor;
    function closestElement(el, selector) {
        while (el !== document.documentElement && el != null && !el[matchingFunction](selector)) {
            el = el.parentNode;
        }
        if (el && el[matchingFunction](selector)) {
            return el;
        }
        else {
            return null;
        }
    }
    function getWindowScroll() {
        if ('pageYOffset' in window) {
            return {
                scrollTop: pageYOffset,
                scrollLeft: pageXOffset
            };
        }
        else {
            var sx, sy, d = document, r = d.documentElement, b = d.body;
            sx = r.scrollLeft || b.scrollLeft || 0;
            sy = r.scrollTop || b.scrollTop || 0;
            return {
                scrollTop: sy,
                scrollLeft: sx
            };
        }
    }
    function getClientSize(element, sizeProp) {
        if (element === window) {
            return sizeProp === 'clientWidth' ? window.innerWidth : window.innerHeight;
        }
        else {
            return element[sizeProp];
        }
    }
    function getScrollPos(element, scrollProp) {
        return element === window ? getWindowScroll()[scrollProp] : element[scrollProp];
    }
    function getScrollOffset(vsElement, scrollElement, isHorizontal) {
        var vsPos = vsElement.getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
        var scrollPos = scrollElement === window ? 0 : scrollElement.getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
        var correction = vsPos - scrollPos +
            (scrollElement === window ? getWindowScroll() : scrollElement)[isHorizontal ? 'scrollLeft' : 'scrollTop'];
        return correction;
    }
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            }],
        execute: function() {
            dde = document.documentElement, matchingFunction = dde.matches ? 'matches' :
                dde.matchesSelector ? 'matchesSelector' :
                    dde.webkitMatches ? 'webkitMatches' :
                        dde.webkitMatchesSelector ? 'webkitMatchesSelector' :
                            dde.msMatches ? 'msMatches' :
                                dde.msMatchesSelector ? 'msMatchesSelector' :
                                    dde.mozMatches ? 'mozMatches' :
                                        dde.mozMatchesSelector ? 'mozMatchesSelector' : null;
            ;
            VsFor = (function () {
                function VsFor(_element, _viewContainer, _templateRef, _renderer, _ngZone) {
                    this._element = _element;
                    this._viewContainer = _viewContainer;
                    this._templateRef = _templateRef;
                    this._renderer = _renderer;
                    this._ngZone = _ngZone;
                    this._originalCollection = [];
                    this._slicedCollection = [];
                    this.view = this._viewContainer.createEmbeddedView(this._templateRef);
                    this.parent = this._element.nativeElement.nextElementSibling;
                    var tagName = 'div';
                    if (this.parent.attributes['vs-tag']) {
                        tagName = this.parent.attributes['vs-tag'].value;
                    }
                    this.initPlaceholders(tagName);
                }
                Object.defineProperty(VsFor.prototype, "originalCollection", {
                    get: function () {
                        return this._originalCollection;
                    },
                    set: function (value) {
                        this._originalCollection = value || [];
                        this.refresh();
                        // this.slicedCollection = value.slice(1, -1);
                        // this.view.setLocal('vsCollection', this.slicedCollection);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VsFor.prototype, "slicedCollection", {
                    get: function () {
                        return this._slicedCollection;
                    },
                    set: function (value) {
                        this._slicedCollection = value;
                        this.view.setLocal('vsCollection', this._slicedCollection);
                    },
                    enumerable: true,
                    configurable: true
                });
                VsFor.prototype.initPlaceholders = function (tagName) {
                    this.before = document.createElement(tagName);
                    this.before.className = 'vsFor-before';
                    this.after = document.createElement(tagName);
                    this.after.className = 'vsFor-after';
                    this.parent.insertBefore(this.before, this.parent.childNodes[0]);
                    this.parent.appendChild(this.after);
                    if (this.__horizontal) {
                        this.before.style.height = '100%';
                        this.after.style.height = '100%';
                    }
                    else {
                        this.before.style.width = '100%';
                        this.after.style.width = '100%';
                    }
                };
                VsFor.prototype.ngOnInit = function () {
                    var _this = this;
                    this.__horizontal = false;
                    this.__autoSize = true;
                    this.__sizesPropertyExists = false;
                    this.__options = {};
                    this.clientSize = this.__horizontal ? 'clientWidth' : 'clientHeight',
                        this.offsetSize = this.__horizontal ? 'offsetWidth' : 'offsetHeight',
                        this.scrollPos = this.__horizontal ? 'scrollLeft' : 'scrollTop';
                    if (this.parent.attributes['vs-scroll-parent']) {
                        this.scrollParent = closestElement(this.parent, this.parent.attributes['vs-scroll-parent'].value);
                    }
                    else {
                        this.scrollParent = this.parent;
                    }
                    this.elementSize = getClientSize(this.scrollParent, this.clientSize) || 50;
                    this.offsetBefore = 0;
                    this.offsetAfter = 0;
                    this.excess = 2;
                    this.totalSize = 0;
                    if (this.__sizesPropertyExists) {
                        this.sizesCumulative = [];
                    }
                    // Object.keys(attributesDictionary).forEach(function(key) {
                    //     if ($attrs[key]) {
                    //         $attrs.$observe(key, function(value) {
                    //             // '+' serves for getting a number from the string as the attributes are always strings
                    //             $scope[attributesDictionary[key]] = +value;
                    //             reinitialize();
                    //         });
                    //     }
                    // });
                    this.startIndex = 0;
                    this.endIndex = 0;
                    this.scrollParent.addEventListener('scroll', function () {
                        _this.updateInnerCollection();
                    });
                    // function onWindowResize() {
                    //     if (typeof $attrs.vsAutoresize !== 'undefined') {
                    //         autoSize = true;
                    //         setAutoSize();
                    //         if ($scope.$root && !$scope.$root.$$phase) {
                    //             $scope.$apply();
                    //         }
                    //     }
                    //     if (updateInnerCollection()) {
                    //         $scope.$apply();
                    //     }
                    // }
                    // angular.element(window).on('resize', onWindowResize);
                    // $scope.$on('$destroy', function() {
                    //     angular.element(window).off('resize', onWindowResize);
                    // });
                    // $scope.$on('vsRepeatTrigger', refresh);
                    // $scope.$on('vsRepeatResize', function() {
                    //     autoSize = true;
                    //     setAutoSize();
                    // });
                    // $scope.$on('vsRenderAll', function() {//e , quantum) {
                    //     if ($$options.latch) {
                    //         setTimeout(function() {
                    //             // var __endIndex = Math.min($scope.endIndex + (quantum || 1), originalLength);
                    //             var __endIndex = originalLength;
                    //             _maxEndIndex = Math.max(__endIndex, _maxEndIndex);
                    //             $scope.endIndex = $$options.latch ? _maxEndIndex : __endIndex;
                    //             this.slicedCollection = originalCollection.slice($scope.startIndex, $scope.endIndex);
                    //             _prevEndIndex = $scope.endIndex;
                    //             $scope.$$postDigest(function() {
                    //                 var layoutProp = $$horizontal ? 'width' : 'height';
                    //                 $beforeContent.css(layoutProp, 0);
                    //                 $afterContent.css(layoutProp, 0);
                    //             });
                    //             $scope.$apply(function() {
                    //                 $scope.$emit('vsRenderAllDone');
                    //             });
                    //         });
                    //     }
                    // });
                    // var _prevClientSize;
                    // function reinitOnClientHeightChange() {
                    //     var ch = getClientSize($scrollParent[0], clientSize);
                    //     if (ch !== _prevClientSize) {
                    //         reinitialize();
                    //         if ($scope.$root && !$scope.$root.$$phase) {
                    //             $scope.$apply();
                    //         }
                    //     }
                    //     _prevClientSize = ch;
                    // }
                    // $scope.$watch(function() {
                    //     if (typeof window.requestAnimationFrame === 'function') {
                    //         window.requestAnimationFrame(reinitOnClientHeightChange);
                    //     }
                    //     else {
                    //         reinitOnClientHeightChange();
                    //     }
                    // });
                };
                VsFor.prototype.refresh = function () {
                    var _this = this;
                    if (!this.originalCollection || this.originalCollection.length < 1) {
                        this.slicedCollection = [];
                        this.originalLength = 0;
                        this.updateTotalSize(0);
                        this.sizesCumulative = [0];
                        return;
                    }
                    else {
                        this.originalLength = this.originalCollection.length;
                        if (this.__sizesPropertyExists) {
                            this.sizes = this.originalCollection.map(function (item) {
                                // var s = $scope.$new(false);
                                // angular.extend(s, item);
                                // s[lhs] = item;
                                // var size = ($attrs.vsSize || $attrs.vsSizeProperty) ?
                                //     s.$eval($attrs.vsSize || $attrs.vsSizeProperty) :
                                //     $scope.elementSize;
                                // s.$destroy();
                                var size = 10; // TODO
                                return size;
                            });
                            var sum = 0;
                            this.sizesCumulative = this.sizes.map(function (size) {
                                var res = sum;
                                sum += size;
                                return res;
                            });
                            this.sizesCumulative.push(sum);
                        }
                        else {
                            var unsub = async_1.ObservableWrapper.subscribe(this._ngZone.onEventDone, function () {
                                _this.setAutoSize();
                                unsub();
                            });
                        }
                    }
                    this.reinitialize();
                };
                VsFor.prototype.updateTotalSize = function (size) {
                    this.totalSize = this.offsetBefore + size + this.offsetAfter;
                };
                VsFor.prototype.reinitialize = function () {
                    this._prevStartIndex = void 0;
                    this._prevEndIndex = void 0;
                    this._minStartIndex = this.originalLength;
                    this._maxEndIndex = 0;
                    this.updateInnerCollection();
                    this.updateTotalSize(this.__sizesPropertyExists ?
                        this.sizesCumulative[this.originalLength] :
                        this.elementSize * this.originalLength);
                };
                VsFor.prototype.setAutoSize = function () {
                    var _this = this;
                    if (this.__autoSize) {
                        if (this.parent.offsetHeight || this.parent.offsetWidth) {
                            var child = this.parent.children[1];
                            var gotSomething = false;
                            if (child[this.offsetSize]) {
                                gotSomething = true;
                                this.elementSize = child[this.offsetSize];
                                console.warn('autosized', this.elementSize);
                            }
                            if (gotSomething) {
                                this.__autoSize = false;
                                this._ngZone.run(function () {
                                    _this.reinitialize();
                                });
                            }
                        }
                    }
                };
                VsFor.prototype.updateInnerCollection = function () {
                    var $scrollPosition = getScrollPos(this.scrollParent, this.scrollPos);
                    var $clientSize = getClientSize(this.scrollParent, this.clientSize);
                    var scrollOffset = this.parent === this.scrollParent ? 0 : getScrollOffset(this.parent, this.scrollParent, this.__horizontal);
                    var __startIndex = this.startIndex;
                    var __endIndex = this.endIndex;
                    if (this.__sizesPropertyExists) {
                        __startIndex = 0;
                        while (this.sizesCumulative[__startIndex] < $scrollPosition - this.offsetBefore - scrollOffset) {
                            __startIndex++;
                        }
                        if (__startIndex > 0) {
                            __startIndex--;
                        }
                        // Adjust the start index according to the excess
                        __startIndex = Math.max(Math.floor(__startIndex - this.excess / 2), 0);
                        __endIndex = __startIndex;
                        while (this.sizesCumulative[__endIndex] < $scrollPosition - this.offsetBefore - scrollOffset + $clientSize) {
                            __endIndex++;
                        }
                        // Adjust the end index according to the excess
                        __endIndex = Math.min(Math.ceil(__endIndex + this.excess / 2), this.originalLength);
                    }
                    else {
                        __startIndex = Math.max(Math.floor(($scrollPosition - this.offsetBefore - scrollOffset) / this.elementSize) - this.excess / 2, 0);
                        __endIndex = Math.min(__startIndex + Math.ceil($clientSize / this.elementSize) + this.excess, this.originalLength);
                    }
                    this._minStartIndex = Math.min(__startIndex, this._minStartIndex);
                    this._maxEndIndex = Math.max(__endIndex, this._maxEndIndex);
                    this.startIndex = this.__options.latch ? this._minStartIndex : __startIndex;
                    this.endIndex = this.__options.latch ? this._maxEndIndex : __endIndex;
                    var digestRequired = false;
                    if (this._prevStartIndex == null) {
                        digestRequired = true;
                    }
                    else if (this._prevEndIndex == null) {
                        digestRequired = true;
                    }
                    if (!digestRequired) {
                        if (this.__options.hunked) {
                            if (Math.abs(this.startIndex - this._prevStartIndex) >= this.excess / 2 ||
                                (this.startIndex === 0 && this._prevStartIndex !== 0)) {
                                digestRequired = true;
                            }
                            else if (Math.abs(this.endIndex - this._prevEndIndex) >= this.excess / 2 ||
                                (this.endIndex === this.originalLength && this._prevEndIndex !== this.originalLength)) {
                                digestRequired = true;
                            }
                        }
                        else {
                            digestRequired = this.startIndex !== this._prevStartIndex ||
                                this.endIndex !== this._prevEndIndex;
                        }
                    }
                    // console.warn(this.startIndex, this.endIndex);
                    if (digestRequired) {
                        this.slicedCollection = this.originalCollection.slice(this.startIndex, this.endIndex);
                        // Emit the event
                        // $scope.$emit('vsRepeatInnerCollectionUpdated', this.startIndex, this.endIndex, this._prevStartIndex, this._prevEndIndex);
                        this._prevStartIndex = this.startIndex;
                        this._prevEndIndex = this.endIndex;
                        var o1 = this._getOffset(0);
                        var o2 = this._getOffset(this.slicedCollection.length);
                        var total = this.totalSize;
                        var layoutProp = this.__horizontal ? 'width' : 'height';
                        this.before.style[layoutProp] = o1 + 'px';
                        this.after.style[layoutProp] = (total - o2) + 'px';
                    }
                    return digestRequired;
                };
                VsFor.prototype._getOffset = function (index) {
                    if (this.__sizesPropertyExists) {
                        return this.sizesCumulative[index + this.startIndex] + this.offsetBefore;
                    }
                    return (index + this.startIndex) * this.elementSize + this.offsetBefore;
                };
                VsFor = __decorate([
                    core_1.Directive({
                        selector: '[vsFor]',
                        inputs: [
                            'originalCollection: vsFor'
                        ]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.ViewContainerRef, core_1.TemplateRef, core_1.Renderer, core_1.NgZone])
                ], VsFor);
                return VsFor;
            })();
            exports_1("VsFor", VsFor);
        }
    }
});
//# sourceMappingURL=ng2-vs-for.js.map