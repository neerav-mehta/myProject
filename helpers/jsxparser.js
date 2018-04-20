class JSXParser {


    constructor() {
    }
    render(dataModelArr) {
        var returnValue = '';
        for(var i = 0; i< dataModelArr.length; i++) {
            var data = dataModelArr[i].data;
            var domTree = this.createDomTree(dataModelArr[i].template);
            this.parseDOMTree(domTree, data);
            returnValue = returnValue + this.printDomTree(domTree);
        }

        return returnValue;
    }

    getDomNode(str) {
        var domObject = {};
        str = str.replace(/\s\s+/g, ' ');
        var domObjProps = str.split(' ');
        domObject.type = domObjProps[0];
        for (var i = 1; i < domObjProps.length; i++) {
            var propName = this.getValueBetweenElements(domObjProps[i], undefined, '=');
            var propValue = this.getValueBetweenElements(domObjProps[i], '"', '"', true);
            domObject[propName] = propValue
        }
        domObject.children = [];
        return domObject;
    }


    getValueBetweenElements(str, start, end, isLastIndex) {
        if (start && end) {
            if (isLastIndex)
                return str.substring(str.indexOf(start) + start.length, str.lastIndexOf(end));
            else
                return str.substring(str.indexOf(start) + start.length, str.indexOf(end));
        }
        else if (start && !end)
            return str.substring(str.indexOf(start) + start.length);
        else if (!start && end)
            return str.substring(0, str.indexOf(end));
    }

    createDomTree(str) {
        var openStack = [];
        var element = this.getValueBetweenElements(str, '<', '>');
        var elementDOM = this.getDomNode(element);

        openStack.push(elementDOM);

        str = this.getValueBetweenElements(str, '<' + element + '>');

        while (str != '') {
            for (var i = 0; i < str.length; i++) {
                if (str.charAt(i) == '<') {
                    if (str.charAt(i + 1) != '/') {
                        var element = this.getValueBetweenElements(str, '<', '>');
                        var elementDOM = this.getDomNode(element);
                        openStack.push(elementDOM);
                        str = this.getValueBetweenElements(str, '<' + element + '>');
                        break;
                    }
                    else {
                        var element = this.getValueBetweenElements(str, '</', '>');
                        str = this.getValueBetweenElements(str, '</' + element + '>');
                        if (openStack.length > 1) {
                            var closedElement = openStack.pop();
                            openStack[openStack.length - 1].children.push(closedElement);
                        }
                        break;
                    }
                }
                else {
                    var element = this.getValueBetweenElements(str, undefined, '<');
                    openStack[openStack.length - 1].innerHTML = element;
                    str = this.getValueBetweenElements(str, element);
                    break;
                }
            }
        }

        return openStack[0];
    }


    parseDOMTree(rootNode, data) {
        if (rootNode == undefined) return;
        if (rootNode.innerHTML) {
            rootNode.innerHTML = rootNode.innerHTML.replace(/{.*}/ig, function (path) {
                path = path.slice(1, -1);
                path = path.split('.');
                var current = data;
                while (path.length) {
                    if (typeof current !== 'object') return undefined;
                    current = current[path.shift()];
                }
                return current;
            });
        }
        rootNode.children.forEach((function (node) {
            this.parseDOMTree(node, data);
        }).bind(this));
    }


    printDomTree(rootNode) {
        var returnValue = `<${rootNode.type}`;
        if (rootNode == undefined) return;
        Object.keys(rootNode).forEach(function (key) {
            if (key != 'children' && key != "type" && key != "innerHTML")
                returnValue = `${returnValue} ${key !== 'className' ? key : 'class'}="${rootNode[key]}"`;
        });
        returnValue = `${returnValue}> ${rootNode.innerHTML ? rootNode.innerHTML : ''}`;
        returnValue = returnValue + rootNode.children.map(this.printDomTree.bind(this));
        returnValue = `${returnValue} </${rootNode.type}>`;

        return returnValue;
    }
}

module.exports = JSXParser;

