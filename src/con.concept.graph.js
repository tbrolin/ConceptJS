concept.define('graph', ['concept.uuid'], function () {
  var UUID = concept('concept.uuid');

  if (!this.Graph) {
    var Graph = function () {
      if (!(this instanceof Graph)) {
        return new Graph();
      }
      this.size = 0;
      this.nodes = {};
      this.edges = {};
    };

    Graph.prototype.addNode = function (node) {
      if (!node.hasOwnProperty('_nodeId') || !this.hasNode(node)) {
        node._nodeId = UUID.generate();
        this.nodes[node._nodeId] = node;
        this.edges[node._nodeId] = [];
      }
    };

    Graph.prototype.hasNode = function (node) {
      return this.nodes[node._nodeId] ? true : false;
    };

    Graph.prototype.addEdge = function (from, to) {
      if (!this.hasEdge(from, to)) {
        this.edges[from._nodeId].push(to);
      }
    };

    Graph.prototype.hasEdge = function (from, to) {
      var index, edges = this.edges[from._nodeId];
      for (index = 0; index < edges.length; index++) {
        if (edges[index]._nodeId === to._nodeId) {
          return true;
        }
      }
      return false;
    };

    Graph.prototype.getAdjacencies = function (node) {
      return this.edges[node._nodeId];
    };

    Graph.prototype.getPath = function (root, target, where) {
      var path = [], queue = [], adjacs = [], index = 0, test;
      where = where || function (a, b) { return a._nodeId === b._nodeId; };
      queue.push(root);
      while (queue.length > 0) {
        test = queue.shift();
        path.push(test);
        if (where(test, target)) {
          return path;
        }
        adjacs = graph.getAdjacencies(test);
        if (adjacs.length === 0) {
          path.pop();
        }
        for (index = 0; index < adjacs.length; index++) {
          queue.push(adjacs[index]);
        }
      }
    };

    this.Graph = Graph;
  }
  return this.Graph;
});
