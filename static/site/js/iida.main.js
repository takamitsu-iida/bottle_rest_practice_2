/* global angular, iida */
(function() {
  'use strict';

  // モジュール名iidaはiida.startup.jsでグローバル変数として定義している
  var moduleName = iida.moduleName;

  // AngularJSにモジュールとして登録
  angular.module(moduleName, [
    'ngResource', // REST APIを叩くのに必要
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
    'ui.router',
    'angularUtils.directives.dirPagination'
  ]);

  // Angular Materialの動作設定
  // デフォルトのテーマを使いつつ、色を変更する
  angular.module(moduleName).config(['$mdThemingProvider', '$mdIconProvider', function($mdThemingProvider, $mdIconProvider) {
    // テーマ色
    $mdThemingProvider
      .theme('default')
      .primaryPalette('deep-purple')
      .accentPalette('indigo');

    // アイコンを登録
    // 要http-server
    // index.htmlをローカルファイルとして開くとクロスドメインでの読み込みになり、うまく動かない
    // フォントとして読むのがいいのかもしれないけど、それならfont-awesomeの方が使い勝手が良い
    /*
    $mdIconProvider
      .icon("menu", "./static/site/svg/ic_menu_white_24px.svg", 24)
      .icon("close", "./static/site/svg/ic_close_white_24px.svg", 24)
      .icon("setting", "./static/site/svg/ic_settings_white_24px.svg", 24);
    */
    // HTMLではこのように指定する <md-icon md-svg-icon="setting"></md-icon>
  }]);

  // $log設定
  // $log.debug();によるデバッグメッセージの表示・非表示設定
  angular.module(moduleName).config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(false);
  }]);

  // 戻るボタン用のディレクティブ
  // <back></back>
  angular.module(moduleName).directive('back', ['$window', function($window) {
    // オブジェクトを返却
    return {
      restrict: 'E',
      replace: true,
      template: '<button type="button" class="btn btn-primary">戻る</button>',
      link: function(scope, elem, attrs) {
        elem.bind('click', function() {
          $window.history.back();
        });
      }
    };
  }]);

  // サービス 'settingParamService'
  // 各コントローラはこのサービスをインジェクションして、angular.extend()でミックスインして利用する
  angular.module(moduleName).service('settingParamService', [function() {
    var svc = this;

    // 設定条件をまとめたオブジェクト
    svc.settingParam = {
      // ng-ifでこれをバインドすれば、デバッグ目的で入れている要素の表示・非表示が切り替わる
      debug: false,
      // コンフィグを表示するかどうか
      showConf: true
    };
  }]);

  // コントローラ 'settingController'
  angular.module(moduleName).controller('settingController', ['settingParamService', function(settingParamService) {
    var ctrl = this;

    ctrl.title = '動作設定';
    angular.extend(ctrl, settingParamService);
  }]);

  // UI Router
  // ルーティング設定
  angular.module(moduleName).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // 一致しないURLは全て/に飛ばす
    $urlRouterProvider.otherwise('/');

    // ステートとURLを対応付ける
    // ここで定義するURLは実際に接続に行くURLではなく、#以下の識別子にすぎないので、REST APIと被ってても構わない
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'index.tpl',
        controller: 'indexController',
        controllerAs: 'indexCtrl'
      })
      .state('rest', {
        url: '/rest',
        templateUrl: 'rest.tpl',
        controller: 'restController',
        controllerAs: 'restCtrl'
      })
      .state('rest.query', {
        url: '/rest/query',
        templateUrl: 'rest.query.tpl',
        controller: 'restQueryController',
        controllerAs: 'ctrl'
      })
      .state('rest.get', {
        url: '/rest/get',
        templateUrl: 'rest.get.tpl',
        controller: 'restGetController',
        controllerAs: 'ctrl'
      })
      .state('rest.save', {
        url: '/rest/save',
        templateUrl: 'rest.save.tpl',
        controller: 'restSaveController',
        controllerAs: 'ctrl'
      })
      .state('rest.delete', {
        url: '/rest/delete',
        templateUrl: 'rest.delete.tpl',
        controller: 'restDeleteController',
        controllerAs: 'ctrl'
      })
      .state('rest.update', {
        url: '/rest/update',
        templateUrl: 'rest.update.tpl',
        controller: 'restUpdateController',
        controllerAs: 'ctrl'
      })
      .state('setting', {
        url: '/setting',
        templateUrl: 'setting.tpl',
        controller: 'settingController',
        controllerAs: 'settingCtrl'
      });
  }]);

  // <body>にバインドする最上位のコントローラ
  // 主にレイアウトを担当
  angular.module(moduleName).controller('topController', ['$scope', '$mdMedia', '$mdSidenav', '$mdComponentRegistry', '$window', function($scope, $mdMedia, $mdSidenav, $mdComponentRegistry, $window) {
    var ctrl = this;

    // ツールバーの左に表示するロゴ
    ctrl.logoTitle = 'Bottle REST Practice';

    // ツールバーに表示するリンク
    ctrl.links = [
      {
        title: 'リンク1',
        label: 'link 1',
        url: '#'
      },
      {
        title: 'リンク2',
        label: 'link 2',
        url: '#'
      }
    ];

    // サイドナビの識別子
    // HTMLで指定するmd-component-idと一致させる必要あり
    // <md-sidenav md-component-id="sidenav">
    var componentId = 'sidenav';

    // サイドナビを隠すべき状態かどうか
    function sidenavHidden() {
      return !$mdMedia('gt-sm');
    }

    ctrl.enableShowSidenav = function() {
      // サイドナビが有効になっていない可能性があるため、存在するかどうかを確認する
      // シンプルなアプリならこの確認は不要
      // サイドナビを開けたまま違うページに遷移するなら、このチェックが必要
      if (!$mdComponentRegistry.get(componentId)) {
        return false;
      }
      return sidenavHidden() && !$mdSidenav(componentId).isOpen();
    };

    ctrl.enableCloseSidenav = function() {
      if (!$mdComponentRegistry.get(componentId)) {
        return false;
      }
      return sidenavHidden() && $mdSidenav(componentId).isOpen();
    };

    ctrl.openSidenav = function() {
      if (!$mdComponentRegistry.get(componentId)) {
        return;
      }
      $mdSidenav(componentId).open();
    };

    ctrl.closeSidenav = function() {
      if (!$mdComponentRegistry.get(componentId)) {
        return;
      }
      $mdSidenav(componentId).close();
    };

    ctrl.hideSidenav = function() {
      return sidenavHidden();
    };

    // back()でひとつ前のページに戻る
    ctrl.back = function() {
      $window.history.back();
    };
  }]);

  // トップページ用のコントローラ
  // indexController
  // タイトルとか、日付とか、作者とか、
  angular.module(moduleName).controller('indexController', [function() {
    var ctrl = this;

    ctrl.title = 'Bottle REST Angular連携';
    ctrl.description = 'Python bottleフレームワークでREST APIを提供し、AngularJSでそれを叩く練習です。';
    ctrl.date = '2016/07/21';
    ctrl.author = 'Takamitsu IIDA';
    ctrl.mail = 'iida@jp.fujitsu.com';
  }]);

  // データを格納するサービス
  // 'dataService'
  angular.module(moduleName).service('dataService', [function() {
    var svc = this;

    // サービスとして提供するオブジェクト
    svc.users = [];
  }]);

  // REST APIを叩く$resourceファクトリ
  angular.module(moduleName).factory('userResource', ['$resource', '$location', function($resource, $location) {
    // 標準で定義済みのアクション query(), get(), save(), delete()
    // 個別定義のアクション update()
    return $resource(
      // 第一引数はURL
      // 'http://localhost:8000/names/:name',
      // :nameはプレースホルダなので、/rest/users/iidaのようなURLに変換される
      $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/rest/users/:name', {
        // 第二引数はデフォルトパラメータ
        // URLのプレースホルダとオブジェクト内のキー名とを対応付ける
        name: '@name'
      }, {
        // 第三引数はアクションの定義
        query: {
          // 複数のデータを取得
          method: 'GET',
          isArray: false // デフォルトはtrue
        },
        get: {
          // 単一のデータを取得
          method: 'GET'
        },
        save: {
          // 新規データを登録
          method: 'POST'
        },
        delete: {
          // 既存データを削除
          method: 'DELETE'
        },
        update: {
          // データを修正
          method: 'PUT'
        }
      }
    );
  }]);

  // コントローラ 'restController'
  angular.module(moduleName).controller('restController', ['dataService', 'userResource', function(dataService, userResource) {
    var ctrl = this;

    // データサービスが初期化時にquery()するなら、その完了状態を確認した方がいい。
    // $stateをインジェクトして$watchする必要あり。

    // データを取得済みかどうか
    // 初期状態ではfalseにして、usersデータのダウンロードに成功したらtrueに返るのが正しい動作。
    ctrl.isDataFetched = true;

    // サイドバーに表示するメニューと、飛ばす先のui-routerステート
    ctrl.menus = [
      {
        title: 'query()',
        description: 'データを一覧で取得します',
        state: 'rest.query'
      },
      {
        title: 'get()',
        description: '特定のデータを取得します',
        state: 'rest.get'
      },
      {
        title: 'save()',
        description: '新規にデータを追加します',
        state: 'rest.save'
      },
      {
        title: 'delete()',
        description: '既存のデータを削除します',
        state: 'rest.delete'
      },
      {
        title: 'update()',
        description: '既存のデータを書き換えます',
        state: 'rest.update'
      }
    ];
  }]);

  // コントローラ 'restQueryController'
  angular.module(moduleName).controller('restQueryController', ['dataService', 'userResource', function(dataService, userResource) {
    var ctrl = this;

    // query()
    // HTTP GET
    // 複数のデータを取得
    ctrl.query = function() {
      // get()を発行して得られるプロミスを取得
      var promise = userResource.get().$promise;

      // 実行完了時の処理を指定する
      promise.then(function(data) {
        console.log(data);
        if ('users' in data) {
          // コントローラとサービスが持つ値を差し替える
          ctrl.users = data.users;
          dataService.users = data.users;
        }
      }).catch(function(data, status) {
        console.log(data);
      });
    };
  }]);

  // コントローラ 'restGetController'
  angular.module(moduleName).controller('restGetController', ['dataService', 'userResource', function(dataService, userResource) {
    var ctrl = this;

    // 特定の名前を指定する
    // ビューの<input>と紐付ける
    ctrl.getParam = {
      name: ''
    };

    // get()
    // HTTP GET
    // 単一のデータを取得
    ctrl.get = function() {
      // REST APIのサーバに渡すパラメータ
      var param = {
        name: ctrl.getParam.name
      };

      userResource
        .get(param)
        .$promise
        .then(function(user) {
          ctrl.user = user;
        })
        .catch(function(data, status) {
          console.log('error');
        });
    };
  }]);

  // コントローラ 'restSaveController'
  angular.module(moduleName).controller('restSaveController', ['dataService', 'userResource', function(dataService, userResource) {
    var ctrl = this;

    // ビューの<input>と紐付けた新規ユーザ名
    ctrl.saveParams = {
      newUserName: '',
      message: '保存できるかな？'
    };

    // save()
    // HTTP POST
    // 新規データを登録
    ctrl.save = function() {
      var param = {
        name: ctrl.saveParams.newUserName,
        message: '新規ユーザ'
      };

      userResource
        .save(param)
        .$promise
        .then(function(data) {
          console.log(data);
          ctrl.query();
        })
        .catch(function(obj, status) {
          console.log(obj);
        })
        .finally(function() {
          ctrl.newUserName = '';
        });
    };
  }]);

  // コントローラ 'restDeleteController'
  angular.module(moduleName).controller('restDeleteController', ['dataService', 'userResource', function(dataService, userResource) {
    var ctrl = this;

    // ビューの<input>と紐付けた削除するユーザ名
    ctrl.deleteParams = {
      deleteUserName: ''
    };

    // delete()
    // HTTP DELETE
    // データを削除
    ctrl.delete = function() {
      var param = {
        name: ctrl.deleteParams.deleteUserName
      };

      userResource
        .delete(param)
        .$promise
        .then(function(data) {
          console.log(data);
        })
        .catch(function(data, status) {
          console.log(data);
        });
    };
  }]);

  // コントローラ 'restUpdateController'
  angular.module(moduleName).controller('restUpdateController', ['dataService', 'userResource', function(dataService, userResource) {
    var ctrl = this;

    // ビューの<input>と紐付けた既存ユーザ名、変更名
    ctrl.updateParams = {
      oldUserName: '',
      newUserName: '',
      message: '変更できるかな？'
    };

    // update()
    // HTTP PUT
    // データを更新
    // GETメソッド以外のアクションを実行するときはprefixに「$」をつける
    ctrl.update = function() {
      var param = {
        name: ctrl.updateParams.oldUserName,
        newName: ctrl.updateParams.newUserName
      };

      userResource
        .update(param)
        .$promise
        .then(function(data) {
          console.log(data);
        })
        .catch(function(data, status) {
          console.log(data);
        });
    };
  }]);
})();
