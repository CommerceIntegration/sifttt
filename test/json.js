require('chai').should();
var uut = require('../lib/json');

describe('json', function() {
  it('parse ok', function() {
    uut(
      {source: 'a', target: 'b'},
      {a: '{"c": 1}'}
    )
      .should.eql({a: '{"c": 1}', b: {c: 1}});
  });

  it('parse error', function() {
    (function() {
      uut(
        {source: 'a', target: 'b'},
        {a: '{c: 1}'}
      );
    }).should.throw('Unable to parse JSON from \'a\': SyntaxError: Unexpected' +
      ' token c');
  });

  it('missing source', function() {
    (function() {
      uut(
        {source: 'c', target: 'b'},
        {a: 1}
      );
    }).should.throw('Unable to parse JSON from \'c\': SyntaxError: Unexpected' +
      ' end of input');
  });

  describe('conditional', function() {
    it('property does not exist', function() {
      uut(
        {
          'if': '#{missingProperty}',
          source: 'a',
          target: 'b'
        },
        {a: '{"c": 1}'}
      )
        .should.eql({a: '{"c": 1}'});
    });

    it('property does exist', function() {
      uut(
        {
          'if': '#{c}',
          source: 'a',
          target: 'b'
        },
        {a: '{"c": 1}', c: true}
      )
        .should.eql({a: '{"c": 1}', b: {c: 1}, c: true});
    });
  });

});
