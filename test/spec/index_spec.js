describe('基本動作テスト', function() {

  // angularの$filter
  var $filter;

  // $httpBackendモック
  var $httpBackend;

  // ルートスコープ
  var $rootScope;

  // コントローラを作成するための$controller
  var $controller;

  // 自分で定義したサービス、コントローラ
  var dataService;
  var settingParamService;
  var userResource;
  var restController;

  // RESTの応答
  var userList = {
    users: [{
      name: 'aaa'
    }, {
      name: 'bbb'
    }]
  };

  var queryResponse = {
    status: 'SUCCESS',
    message: '',
    users: userList
  };

  beforeEach(function() {
    // モジュールを有効化
    module(iida.moduleName);
  });

  // 初期化処理
  beforeEach(inject(function($injector) {

    // filterフィルターをインスタンス化
    $filter = $injector.get('$filter');

    // HTTPサービスのモックをインスタンス化
    $httpBackend = $injector.get('$httpBackend');

    // 応答の設定
    $httpBackend.when('GET', 'http://server:80/rest/users').respond(queryResponse);

    // ルートスコープ
    $rootScope = $injector.get('$rootScope');

    // コントローラ
    $controller = $injector.get('$controller');

    // テスト対象のコントローラを初期化する
    // スコープオブジェクトをインスタンス化
    var scope = $rootScope.$new();

    dataService = $injector.get('dataService');
    settingParamService = $injector.get('settingParamService');
    userResource = $injector.get('userResource');

    var arg = {
      '$scope': scope,
      'dataService': dataService,
      'settingParamService': settingParamService,
      'userResource': userResource
    };

    // コントローラのインスタンス化
    restController = $controller('restController', arg);

  }));


  // 1 + 1 = 2 の確認
  it('テストランナー動作チェック', function() {
    expect(1 + 1).toEqual(2);
  });

  // angularの$filterの動作を確認
  it('filterフィルタの動作チェック', function() {
    var arr = ['iida', 'takamitsu'];
    var filter = $filter('filter');
    var searchString = 'iid';
    var filtered = filter(arr, searchString);
    expect(filtered).toEqual(['iida']);
  });


  it('コントローラのテスト', function() {

    // 初期状態ではundefined
    expect(restController.users).toBe(undefined);

    // query()を投げる
    restController.query();

    // モックが擬似応答を返す
    $httpBackend.flush();

    // 値が期待通りセットされているか、確認する
    expect(restController.users).toEqual(userList);

  });


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
