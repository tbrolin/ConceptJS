module('ConceptJS - graph', {
  setup: function () {
   var Graph = concept('graph'), g;
   this.g = new Graph();
   g = this.g;
   console.log('graph', g);
   this.nodes = [{ name: 'A' }, { name: 'B' },{ name: 'C' }, { name: 'D' }, { name: 'E' }];
   this.nodes.forEach(function (node) {
     g.addNode(node);
   })
  }
});

test('Graphs are graphs', function () {
  var Graph = concept('graph');
  var g = new Graph();
  var gr = Graph();
  ok(g instanceof Graph, 'Its a Graph!');
  ok(gr instanceof Graph, 'Its a Graph!');
});

test('Added nodes', function () {
  var g = this.g;
  ok(g.size === 5, 'Graph has five nodes in it. (' + g.size + ')');
});

test('Graph has nodes', function () {
  var g = this.g;
  ok(g.hasNode(this.nodes[2]), 'Graph has node "' + this.nodes[2].name + '".');
});

test('Create tree structure', function () {
  var g = this.g, ns = this.nodes;

  g.addEdge(ns[0], ns[1]);
  g.addEdge(ns[0], ns[2]);
  g.addEdge(ns[2], ns[3]);
  g.addEdge(ns[2], ns[4]);

  ok(g.edges[ns[0]._nodeId].length === 2, 'Node A has two edges');
  ok(g.edges[ns[2]._nodeId].length === 2, 'Node C has two edges');
  ok(g.hasEdge(ns[0], ns[2]), 'Node A has edge to node C');
  ok(g.hasEdge(ns[2], ns[4]), 'Node C has edge to node E');
});

test('Get adjacencies', function () {
  var g = this.g, ns = this.nodes;
  g.addEdge(ns[0], ns[1]);
  g.addEdge(ns[0], ns[2]);
  g.addEdge(ns[2], ns[3]);
  g.addEdge(ns[2], ns[4]);
  var adjs = g.getAdjacencies(ns[0]);
  console.log(adjs);
  ok(adjs.length === 2, 'Node A has two adjacencies');
  ok(adjs[0]._nodeId >= 0, 'Adjacency seems to be a node.');
});
