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
        }
    })
});

var RouteElement = document.registerElement('k-route', {
    prototype: Object.create(Element.prototype, {
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
            value: function () {
                var qsIndex = location.hash.indexOf('?');
                var path = location.hash.substring(1, qsIndex === -1 ? location.hash.length : qsIndex);
                return path.indexOf(this.path) === 0;
            }
        },
        attachedCallback: {
            value: function () {
                var self = this;
                a();
                window.addEventListener('hashchange', a);

                function a () {
                    if (self.check()) {
                        self.show();
                    } else {
                        self.hide();
                    }
                }
            }
        }
    })
});