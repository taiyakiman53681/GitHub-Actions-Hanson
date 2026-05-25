# GitHub Actions Hands-on Lab

このリポジトリは、GitHub Actions を段階的に学ぶためのハンズオン教材です。
既存の `docker-lab-ci.yml` は実運用寄りの CI、ここで追加するラボ用 workflow は学習用です。

## 学習の進め方

1. まず `workflow_dispatch` で手動実行し、1つずつ動作を確認する。
2. 次に `pull_request` を追加し、PR 時だけ動かす条件を試す。
3. 最後に matrix、artifact、条件分岐、再利用 workflow に広げる。

## ラボ構成

### Lab 1: 最小構成

学ぶこと:

- `on`
- `jobs`
- `steps`
- `run`
- `actions/checkout`

やること:

- runner 情報を表示する
- リポジトリを checkout する
- `app/index.js` の存在を確認する

確認ポイント:

- どのイベントで動くか
- どの runner で動くか

### Lab 2: Node の基本チェック

学ぶこと:

- `setup-node`
- `npm ci`
- `npm start`
- `env`

やること:

- Node バージョンを固定する
- 依存関係をインストールする
- アプリを起動する

確認ポイント:

- `package-lock.json` があるので `npm ci` を使う理由
- `PORT` を workflow 側から渡す方法

### Lab 3: Docker / Compose

学ぶこと:

- `docker build`
- `docker compose config`
- `docker compose up`
- `if: always()`

やること:

- Compose 設定を検証する
- イメージを build する
- コンテナを起動してログを見る

確認ポイント:

- 失敗しても `down` が走るようにする
- logs を残して原因調査しやすくする

### Lab 4: matrix

学ぶこと:

- `strategy.matrix`
- 複数 Node バージョンの比較

やること:

- Node 18 / 20 / 22 を並列で回す
- どのバージョンで失敗したかを判別する

### Lab 5: artifact

学ぶこと:

- `upload-artifact`
- `download-artifact`

やること:

- テスト結果やログを保存する
- 後続ジョブで読み込む

### Lab 6: 条件分岐

学ぶこと:

- `needs`
- `if`
- `continue-on-error`

やること:

- テスト失敗時にもログを集める
- ビルド失敗時は後続を止める

## 手を動かす順番

1. `lab-01-basics.yml` を実行する
2. `lab-02-node.yml` に `npm ci` と `npm start` を追加する
3. `lab-03-compose.yml` で Docker の流れを確認する
4. `lab-04-matrix.yml` で matrix を試す
5. `lab-05-artifact.yml` で artifact を扱う

## ここから広げるなら

- reusable workflow に分割する
- secrets と environments を追加する
- GHCR へ push する
- Terraform の `fmt` / `validate` / `plan` を回す

