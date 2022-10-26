"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawLabels = void 0;
const utils_1 = require("./utils");
const labella = __importStar(require("labella"));
const lodash_1 = require("lodash");
function drawLabelGroup(labelInfo, root, rootBoundingBox, direction) {
    var labelsOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let labels = labelInfo.map((nodeInfo) => {
        var foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        foreignObject.setAttribute('xmlns', "http://www.w3.org/1999/xhtml");
        // TODO: set max width
        foreignObject.appendChild(nodeInfo.labelElement);
        return foreignObject;
    });
    labels.forEach((node) => labelsOverlay.appendChild(node));
    root.prepend(labelsOverlay);
    let boundingRects = labelInfo.map((info) => {
        var range = document.createRange();
        range.selectNode(info.labelElement);
        return range.getBoundingClientRect();
    });
    let force = new labella.Force({
        minPos: null, nodeSpacing: 12
    }).nodes(labelInfo.map((info, idx) => new labella.Node(info.symbolBoundingBox.center.horizontal, boundingRects[idx].width, info))).compute();
    let nodes = force.nodes();
    let nodeHeight = 12;
    var renderer = new labella.Renderer({
        layerGap: 16,
        nodeHeight,
        direction
    });
    renderer.layout(nodes);
    var viewBox = utils_1.BoundingBox.of(...nodes.map((node, idx) => {
        let bBox = boundingRects[idx];
        return new utils_1.BoundingBox({
            top: node.y - bBox.height,
            left: node.x - bBox.width / 2,
            bottom: node.y + bBox.height,
            right: node.x + bBox.width / 2,
        });
    }), rootBoundingBox.relativeTo(rootBoundingBox));
    let anchorLineY = direction == "up" ? 0 : rootBoundingBox.height;
    if (direction === "up") {
        let style = root.getAttribute('style');
        if (style && !style.endsWith(';'))
            style += ';';
        root.setAttribute('style', style + ` margin-top: ${-viewBox.top - nodeHeight * 1.5}px;`);
    }
    if (direction === "down") {
        let style = root.getAttribute('style');
        if (style && !style.endsWith(';'))
            style += ';';
        root.setAttribute('style', style + ` margin-bottom: ${viewBox.bottom - rootBoundingBox.height + nodeHeight * 2}px;`);
    }
    Object.assign(labelsOverlay.style, {
        position: 'absolute',
        top: viewBox.top - nodeHeight / 2 + anchorLineY,
        left: viewBox.left,
        width: viewBox.width,
        height: viewBox.height + nodeHeight
    });
    labelsOverlay.setAttribute('viewBox', `${viewBox.left} ${viewBox.top - nodeHeight / 2 + anchorLineY} ${viewBox.width} ${viewBox.height + nodeHeight / 2}`);
    nodes.forEach((node, idx) => {
        labels[idx].setAttribute('overflow', 'visible');
        labels[idx].setAttribute('x', `${node.x - node.dx / 2}`);
        labels[idx].setAttribute('width', `${node.dx}`);
        labels[idx].setAttribute('y', `${anchorLineY + node.y -
            (direction === 'up' ? boundingRects[idx].height - node.dy : node.dy / 2)}`);
        labels[idx].setAttribute('height', `${node.dy}`);
        if (direction == 'down')
            labels[idx].setAttribute('dominant-baseline', `hanging`);
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${node.data.symbolBoundingBox.center.horizontal} `
            + `${direction == "up" ? node.data.symbolBoundingBox.top - node.dy / 2 : node.data.symbolBoundingBox.bottom - anchorLineY} L`
            + renderer.generatePath(node).slice(1));
        path.setAttribute('transform', `translate(0, ${anchorLineY - (direction == "up" ? 0 : 0)})`);
        Object.assign(path.style, { stroke: 'black', fill: 'none' });
        labelsOverlay.appendChild(path);
    });
}
function drawLabels(labels, root) {
    // need to make sure element is rendered to find the bounding box
    document.body.appendChild(root); // root is not guaranteed to be already in the tree, so we append our own first
    let visibility = (0, utils_1.setVisible)(root);
    let rootBoundingBox = new utils_1.BoundingBox(root.getBoundingClientRect());
    let labelInfo = labels.map(({ selector, label }) => {
        var _a;
        let elements = [...root.querySelectorAll(selector)];
        let labelElement;
        switch (label.renderType) {
            case "html":
                labelElement = (0, utils_1.toHTMLElement)(label.value);
                break;
            case "plain":
            default:
                labelElement = document.createTextNode(label.value);
                break;
        }
        return {
            symbolBoundingBox: (_a = utils_1.BoundingBox.of(...elements.map(node => new utils_1.BoundingBox(node.getBoundingClientRect())))) === null || _a === void 0 ? void 0 : _a.relativeTo(rootBoundingBox),
            labelElement: labelElement
        };
    }).filter(info => info.symbolBoundingBox);
    let center = rootBoundingBox.relativeTo(rootBoundingBox).center;
    let [bottom, top] = (0, lodash_1.partition)(labelInfo, info => { var _a; return ((_a = info.symbolBoundingBox) === null || _a === void 0 ? void 0 : _a.center.vertical) >= center.vertical; });
    root.style.position = 'relative';
    if (bottom.length > 0)
        drawLabelGroup(bottom, root, rootBoundingBox, "down");
    if (top.length > 0)
        drawLabelGroup(top, root, rootBoundingBox, "up");
    (0, utils_1.resetVisibility)(root, visibility);
}
exports.drawLabels = drawLabels;
