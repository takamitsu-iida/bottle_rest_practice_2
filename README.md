bottle_rest_practice_2
======================

Pythonスクリプトをブラウザで制御するための練習用レポジトリです。
bottleでREST APIを提供する方法、AngularJSでREST APIを利用する方法を確認します。
フロントエンドはAngular Materialを使います。

**動作させるのに必要なもの:** Python2.7

必要なライブラリは全て含めてありますので、追加でダウンロードしたり、インストールが必要なものはありません。そのまま実行可能です。

## 実行方法

1. シェル(コマンドプロンプト)からPythonスクリプトを起動します

    ```
    $ python server.py
    ```

2. ブラウザでhttp://localhost:8000にアクセスします

## ブラウザの注意事項

IEの場合にはlocalhostを信頼済みサイトに入れておかないと開きません。

## ポート番号の変更

ポート番号はconfig.iniから読み取っています。

### 含まれるもの

 - [x] はデフォルトで使っているもの
 - [ ] は設定を変更して使う、もしくは頻繁に使うので置いてあるけどいまは未使用のもの

#### サーバサイド

- [x] bottle 0.12.9
- [ ] gevent 1.1.0
- [ ] gevent-websocket 0.9.5
- [x] tinydb 3.2.1
- [x] jsonpickle 0.9.3
- [ ] requests 2.8.1

#### クライアントサイド

- [x] angular 1.5.8
- [x] angular material 1.1.1
- [ ] angular-utils-pagination 0.11.1
- [x] angular ui-router 0.2.18
- [x] angular-loading-bar　0.9.0
- [ ] font-awesome 4.6.3
- [x] bootstrap 3.3.6 (CSSだけ利用)
