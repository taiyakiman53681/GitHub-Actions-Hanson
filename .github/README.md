# GitHub Actions Hands-on Lab

このリポジトリは、GitHub Actions を段階的に学ぶためのハンズオン教材です。
既存の `docker-lab-ci.yml` は実運用寄りの CI、ここで追加するラボ用 workflow は学習用です。

## 学習の進め方

1. まず `workflow_dispatch` で手動実行し、1つずつ動作を確認する。
2. 次に README の指示どおりに 1 行だけ変えて再実行する。
3. 最後に matrix、artifact、条件分岐、再利用 workflow に広げる。

## 進め方のルール

- 1 回の変更は 1 つだけにする。
- 実行後はログの該当ステップを読む。
- エラーが出たら、まず workflow のどの step で落ちたかを見る。
- 分からなくなったら元に戻して、もう一度最小構成からやる。

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

1 行変更するなら:

- `echo` の文字列を変えて、ログの差分を見る
- `runs-on` を確認して、どの runner で動いているか意識する

参考コード:

```yaml
- name: Explain what this lab teaches
  run: echo "This lab covers on / jobs / steps / run / checkout."
```

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

1 行変更するなら:

- `node-version` を `20` から `22` に変える
- `PORT` を `3001` に変えて、アプリ側とずれていないか確認する
- `npm ci` のあとに `npm start` を止めずに起動ログを見る

参考コード:

```yaml
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 22
```

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

1 行変更するなら:

- `docker compose build` の前後に `docker compose ps` を入れる
- `curl` の待機回数を増やす
- `down` に `if: always()` が付いている理由を確認する

参考コード:

```yaml
      - name: Check health endpoint
        run: |
          for i in $(seq 1 30); do
            if curl --fail --silent --show-error http://127.0.0.1:3000/health; then
              exit 0
            fi
            sleep 1
          done
```

### Lab 4: matrix

学ぶこと:

- `strategy.matrix`
- 複数 Node バージョンの比較

やること:

- Node 18 / 20 / 22 を並列で回す
- どのバージョンで失敗したかを判別する

1 行変更するなら:

- `matrix.node-version` に `24` を追加する
- `fail-fast` を `true` にして挙動を比べる

参考コード:

```yaml
    strategy:
      fail-fast: false
      matrix:
        node-version: [18, 20, 22, 24]
```

### Lab 5: artifact

学ぶこと:

- `upload-artifact`
- `download-artifact`

やること:

- テスト結果やログを保存する
- 後続ジョブで読み込む

1 行変更するなら:

- `reports/result.json` の内容を変える
- artifact 名を変えて、download 側も合わせる

参考コード:

```yaml
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: lab-report
          path: reports/result.json
```

### Lab 6: 条件分岐

学ぶこと:

- `needs`
- `if`
- `continue-on-error`

やること:

- テスト失敗時にもログを集める
- ビルド失敗時は後続を止める

1 行変更するなら:

- `continue-on-error` を付けて失敗を流す
- `if: always()` を外して、ログ回収が止まることを確認する

### Lab 7: Playwright

学ぶこと:

- `push` と `pull_request` で自動起動する workflow
- `playwright test`
- browser のインストール
- artifact で report と test result を残す

やること:

- `/ui` をブラウザで開く
- Playwright に app の起動を任せる
- タイトルとタスクリストが表示されるか確認する
- 失敗時に report を artifact で回収する

確認ポイント:

- 手動実行だけでなく push でも動くか
- 失敗時に screenshot と trace が保存されるか

1 行変更するなら:

- `/ui` の見出しを変えて、テストがどこで落ちるか確認する
- `expect` の文言を変えて、失敗時の artifact を見る

参考コード:

```yaml
      - name: Show logs
        if: always()
        run: docker compose logs
```

## 手を動かす順番

1. `lab-01-basics.yml` を実行する
2. `lab-01-basics.yml` の `echo` を 1 行だけ変えて再実行する
3. `lab-02-node.yml` を実行して、`PORT` と Node バージョンを見比べる
4. `lab-03-compose.yml` を実行して、`build -> up -> logs -> down` の順を追う
5. `lab-04-matrix.yml` で Node バージョンを 1 つ増やしてみる
6. `lab-05-artifact.yml` で artifact の名前や内容を変えてみる
7. `lab-07-playwright.yml` を push で動かして、画面テストの流れを見る

## ここから広げるなら

- reusable workflow に分割する
- secrets と environments を追加する
- GHCR へ push する
- Terraform の `fmt` / `validate` / `plan` を回す
- Playwright の trace viewer を使う

## つまずいたら見る場所

- `workflow_dispatch` で実行したか
- 直前に push した commit が Actions に反映されているか
- 失敗した step のログに、原因がそのまま出ていないか
- `docker compose` 系は `logs` と `ps` を先に見る
