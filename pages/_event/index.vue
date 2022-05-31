<template>
  <v-container>
    <div class="text-h3 transition-swing" v-text="title" />
    <div class="ma-2 mb-5">
      <p
        v-for="(line, i) in description.split('\n')"
        :key="i"
        class="text-justify mb-0 transition-swing"
        v-text="line"
      />
    </div>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">Date</th>
            <th />
            <th v-for="user in votes" :key="user.id" class="text-center">
              <v-btn
                small
                color="accent"
                @click="openVoteDialog(user.id, user.name, user.vote)"
              >
                {{ user.name }}
              </v-btn>
            </th>
            <th>
              <v-btn small color="primary" @click="openVoteDialog()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="date in dates"
            :key="date.id"
            :class="{
              success: highlightScore.indexOf(scores[date.id]) === 0,
              accent: highlightScore.indexOf(scores[date.id]) === 1,
            }"
          >
            <td>{{ date.from.toFormat('yyyy/MM/dd') }}</td>
            <td>
              {{ date.from.toFormat('HH:mm') }} ~
              {{ date.to && date.to.toFormat('HH:mm') }}
            </td>
            <td v-for="user in votes" :key="user.id" class="text-center">
              <v-icon v-if="user.vote[date.id] === 0"> mdi-close </v-icon>
              <v-icon v-else-if="user.vote[date.id] === 1">
                mdi-triangle-outline
              </v-icon>
              <v-icon v-else-if="user.vote[date.id] === 2">
                mdi-circle-outline
              </v-icon>
              <div v-else>-</div>
            </td>
            <td />
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-fab-transition>
      <v-btn
        fixed
        elevation="2"
        fab
        large
        bottom
        right
        color="primary"
        @click="$router.push(`/${$route.params.event}/edit`)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog
      v-model="showVoteDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar flat color="primary">
          <v-btn icon @click="closeVoteDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Vote</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn text> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">Date</th>
                  <th />
                  <th class="text-left">
                    <v-text-field
                      v-model="myName"
                      label="Name"
                      required
                      :rules="[
                        (val) =>
                          (val || '').length > 0 || 'This field is required',
                      ]"
                      counter
                      maxlength="10"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="date in dates" :key="date.id">
                  <td>{{ date.from.toFormat('yyyy/MM/dd') }}</td>
                  <td>
                    {{ date.from.toFormat('HH:mm') }} ~
                    {{ date.to && date.to.toFormat('HH:mm') }}
                  </td>
                  <td>
                    <v-chip-group
                      v-model="myVote[date.id]"
                      mandatory
                      active-class="primary"
                    >
                      <v-chip>
                        <v-icon>mdi-close</v-icon>
                      </v-chip>
                      <v-chip>
                        <v-icon>mdi-triangle-outline</v-icon>
                      </v-chip>
                      <v-chip>
                        <v-icon>mdi-circle-outline</v-icon>
                      </v-chip>
                    </v-chip-group>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { DateTime } from 'luxon'

export default {
  data() {
    return {
      showVoteDialog: false,
      myId: 0,
      myName: '',
      myVote: {},
    }
  },
  methods: {
    openVoteDialog(id, name, vote) {
      this.myId = id || 0
      this.myName = name || ''
      this.myVote = { ...vote }
      this.showVoteDialog = true
    },
    closeVoteDialog() {
      this.showVoteDialog = false
    },
  },
  head() {
    return {
      title: `${this.title}`,
    }
  },
  computed: {
    eventId() {
      return 'eventId'
    },
    title() {
      return 'タイトル'
    },
    description() {
      return 'ほげほげほげほげほげ'
    },
    dates() {
      // 2章で実装したイベント編集コンポーネントのdatesと同じデータ構造
      return [
        {
          id: 1,
          from: DateTime.fromISO('2021-01-01').set({ hour: 15 }),
        },
        {
          id: 2,
          from: DateTime.fromISO('2021-01-02').set({ hour: 15 }),
        },
        {
          id: 3,
          from: DateTime.fromISO('2021-01-03').set({ hour: 15 }),
        },
      ]
    },
    votes() {
      // HELLO
      // 投票データ
      // voteは { [dateのid]: レート } として保持
      // レートは 2, 1, 0 で、それぞれ ○, △, ✕ の表示に対応している
      return [
        {
          id: 1,
          name: 'れい',
          vote: {
            1: 2,
            2: 2,
            3: 1,
          },
        },
        {
          id: 2,
          name: 'りお',
          vote: {
            1: 0,
            2: 2,
            3: 0,
          },
        },
        {
          id: 3,
          name: 'かえで',
          vote: {
            1: 1,
            2: 2,
            3: 0,
          },
        },
      ]
    },
    // 各スケジュール毎に、{日付id:投票情報(日付idに対応する投票idの得点の総和)}のオブジェクトを作成
    // vに入れる。vはオブジェクトの配列となる
    scores() {
      const v = {}
      for (const date of this.dates) {
        // `date.id` をキー、`this.votes` を整形した配列を値としたオブジェクトを作る
        v[date.id] = this.votes
          // 各ユーザから日程に対応する投票結果を抽出、投票がない場合は0
          .map((u) => u.vote[date.id] || 0)
          // 0を初期値として、配列の各要素を足していく
          .reduce((p, c) => p + c, 0)
      }
      // { [日付文字列]: 日程ごとの合計値 } の型になっている
      return v
    },
    highlightScore() {
      // scoresから `values` つまり点数だけを取って配列にする
      const highlights = Object.values(this.scores)
        // 大きい順にソート
        .sort((a, b) => b - a)
        // 上位2つを抜き出す
        .slice(0, 2)
      // 1位の点数が0だったら何もハイライトしない
      return highlights[0] !== 0 ? highlights : []
    },
  },
}
</script>

<style scoped></style>
