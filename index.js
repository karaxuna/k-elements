var Element = document.registerElement('k-element', {
    prototype: Object.create(HTMLElement.prototype, {
        show: {
            value: function () {
                if (this.style.display === 'none') {
                    this.style.display = '';
                }
            }
        },
        hide: {
            value: function () {
                this.style.display = 'none';
            }
        },
        remove: {
            value: function () {
                this.parentNode.removeChild(this);
            }
        },
        getAncestorNodes: {
            value: function (tagName) {
                var parent = this,
                    results = [];
                    
                while (parent = parent.parentNode) {
                    results.push(parent);
                }

                return results;
            }
        },
        getAncestorNodesByTagName: {
            value: function (tagName) {
                return this.getAncestorNodes().filter(function (an) {
                    return an.tagName === tagName.toUpperCase();
                });
            }
        },
        trigger: {
            value: function (eventName) {
                this.dispatchEvent(new Event(eventName));
            }
        }
    })
});

var RouteElement = document.registerElement('k-route', {
    prototype: Object.create(Element.prototype, {
        hashSign: {
            get: function () {
                return location.hash.substring(0, location.hash.indexOf('/'));
            }
        },
        when: {
            get: function () {
                return this.getAttribute('when');
            }
        },
        path: {
            get: function () {
                var ancestorNodes = this.getAncestorNodesByTagName(this.tagName);
                return [this.when].concat(ancestorNodes.map(function (ancestorNode) {
                    return ancestorNode.when;
                })).reverse().join('');
            }
        },
        check: {
            value: function (url) {
                var hash = url.substring(url.indexOf(this.hashSign), url.length);
                var qsIndex = hash.indexOf('?');
                var path = hash.substring(this.hashSign.length, qsIndex === -1 ? hash.length : qsIndex);
                return path.indexOf(this.path) === 0;
            }
        },
        attachedCallback: {
            value: function () {
                var self = this;

                self.addEventListener('activated', function () {
                    self.innerHTML = self.template;
                });

                self.addEventListener('deactivated', function () {
                    self.innerHTML = '';
                });
                
                if (self.check(location.href)) {
                    self.trigger('activated');
                }

                window.addEventListener('hashchange', function (e) {
                    var oldActive = self.check(e.oldURL);
                    var newActive = self.check(e.newURL);

                    if (!oldActive && newActive) {
                        self.trigger('activated');
                    } else if (oldActive && !newActive) {
                        self.trigger('deactivated');
                    }
                });
            }
        },
        createdCallback: {
            value: function () {
                this.template = this.innerHTML;
                this.innerHTML = '';
            }
        }
    })
});