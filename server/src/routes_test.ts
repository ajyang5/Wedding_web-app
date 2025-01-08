import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { save, load, copyMap, resetFilesForTesting } from './routes';



describe('routes', function() {

  it('save', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: 12132, content: "some stuff"}});
    const res = httpMocks.createResponse();
    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {content: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "content" was missing');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "L"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'required argument "content" was missing');

    // Third branch, straight line code
    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: "some stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: true});

    const req5 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: "different stuff"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: true});

    // Called to clear all saved files created in this test
    //    to not effect future tests
    resetFilesForTesting();
  });


  it('load', function() {    
    // First branch, straight line code, error case
    const saveReq1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "An", content: "A"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);

    const loadReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {}});
    const loadRes1 = httpMocks.createResponse();
    load(loadReq1, loadRes1);

    assert.deepStrictEqual(loadRes1._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes1._getData(),
        'required argument "name" was missing');

    const loadReq7 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: 1111, value: "lkcd"}});
    const loadRes7 = httpMocks.createResponse();
    load(loadReq7, loadRes7);

    assert.deepStrictEqual(loadRes7._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes7._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "A"}});
    const loadRes2 = httpMocks.createResponse();
    load(loadReq2, loadRes2);

    assert.deepStrictEqual(loadRes2._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes2._getData(),
        'no file previously saved with this name');

    resetFilesForTesting();
    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "An"}});
    const loadRes3 = httpMocks.createResponse();
    load(loadReq3, loadRes3);

    assert.deepStrictEqual(loadRes3._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes3._getData(),
        'no file previously saved with this name');

    // Third branch, straight line code
    const saveReq2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "Cjbchd", content: "cdddddddd"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    const loadReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "Cjbchd"}});
    const loadRes4 = httpMocks.createResponse();
    load(loadReq4, loadRes4);

    assert.deepStrictEqual(loadRes4._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes4._getData(),
        {name: "Cjbchd", content: "cdddddddd"});


    const saveReq3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "qqqqqpp", content: "Aaaaa"}});
    const saveResp3 = httpMocks.createResponse();
    save(saveReq3, saveResp3);

    const loadReq5 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "qqqqqpp"}});
    const loadRes5 = httpMocks.createResponse();
    load(loadReq5, loadRes5);

    assert.deepStrictEqual(loadRes5._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes5._getData(),
        {name: "qqqqqpp", content: "Aaaaa"});      

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetFilesForTesting();
  });

  it('copyMap', function() {
    const saveReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/save', body: {name: "qqqqqpp", content: "Aaaaa"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);

    const saveReq2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "asd", content: "Aaacadvggaa"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);
    
    // straight-line code
    const copyReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/copyMap', query: {name: "A"}});
    const copyRes1 = httpMocks.createResponse();
    copyMap(copyReq1, copyRes1);

    assert.deepStrictEqual(copyRes1._getStatusCode(), 200);
    assert.deepStrictEqual(copyRes1._getData(),
        {files: [["qqqqqpp", "Aaaaa"], ["asd", "Aaacadvggaa"]]});

    resetFilesForTesting();

    const copyReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/copyMap', query: {name: "A"}});
    const copyRes2 = httpMocks.createResponse();
    copyMap(copyReq2, copyRes2);

    assert.deepStrictEqual(copyRes2._getStatusCode(), 200);
    assert.deepStrictEqual(copyRes2._getData(),
        {files: []});
  });

  it('resetFilesForTesting', function() {
    // straight-line code
    const saveReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/save', body: {name: "qqqqqpp", content: "Aaaaa"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);

    const saveReq2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "asd", content: "Aaacadvggaa"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    resetFilesForTesting();

    const copyReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/copyMap', query: {name: "A"}});
    const copyRes1 = httpMocks.createResponse();
    copyMap(copyReq1, copyRes1);

    assert.deepStrictEqual(copyRes1._getStatusCode(), 200);
    assert.deepStrictEqual(copyRes1._getData(),
        {files: []});


      const saveReq3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "sdcdcd", content: "Aaadaaaaaaa"}});
      const saveResp3 = httpMocks.createResponse();
      save(saveReq3, saveResp3);
  
      resetFilesForTesting();
  
      const copyReq2 = httpMocks.createRequest(
          {method: 'GET', url: '/copyMap', query: {name: "A"}});
      const copyRes2 = httpMocks.createResponse();
      copyMap(copyReq2, copyRes2);
  
      assert.deepStrictEqual(copyRes2._getStatusCode(), 200);
      assert.deepStrictEqual(copyRes2._getData(),
          {files: []});    
  });

});
