exports.action = {
  name: 'cacheTest',
  description: 'I will test the internal cache functions of the API',
  inputs: {
    'required' : ['key', 'value'],
    'optional' : []
  },
  blockedConnectionTypes: [],
  outputExample: {
    cacheTestResults: {
      key: 'key',
      value: 'value',
      saveResp: 'OK',
      loadResp: 'OK',
      deleteResp: 'OK'
    }
  },
  run: function(api, connection, next){
    var key = 'cacheTest_' + connection.params.key;
    var value = connection.params.value;

    connection.response.cacheTestResults = {};

    api.cache.save(key, value, 5000, function(err, resp){
      connection.response.cacheTestResults.saveResp = resp;
      api.cache.size(function(err, numberOfCacheObjects){
        connection.response.cacheTestResults.sizeResp = numberOfCacheObjects;
        api.cache.load(key, function(err, resp, expireTimestamp, createdAt, readAt){
          connection.response.cacheTestResults.loadResp = {
            key: key,
            value: resp,
            expireTimestamp: expireTimestamp,
            createdAt: createdAt,
            readAt: readAt
          };
          api.cache.destroy(key, function(err, resp){
            connection.response.cacheTestResults.deleteResp = resp;
            next(connection, true);
          });
        });
      });
    });
  }
};
