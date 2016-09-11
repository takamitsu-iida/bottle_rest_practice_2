bottle_rest_practice_2
======================

Pythonスクリプトをブラウザで制御するための練習用です。

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

#### サーバサイド

- [x] bottle 0.12.9
- [ ] gevent 1.1.0 (未使用)
- [ ] gevent-websocket 0.9.5 (未使用)
- [x] tinydb 3.2.1
- [x] jsonpickle 0.9.3
- [ ] requests 2.8.1 (未使用)

#### クライアントサイド

- [x] angular 1.5.8
- [x] angular material 1.1.1
- [ ] angular-utils-pagination 0.11.1
- [x] angular ui-router 0.2.18
- [x] angular-loading-bar　0.9.0
- [x] font-awesome 4.6.3
- [x] bootstrap 3.3.6 (エラーページの表示のみ)

