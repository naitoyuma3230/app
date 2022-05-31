<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- タイトル入力 -->
        <v-text-field
          label="Title"
          required
          counter
          :rules="[(val) => (val || '').length > 0 || 'This field is required']"
          maxlength="25"
          v-model="title"
        />
        <!-- 詳細入力 -->
        <v-textarea
          label="Description"
          counter
          maxlength="200"
          v-model="description"
        />
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <!-- 時刻選択 -->
            <v-time-picker format="24hr" v-mdoel="time" />
          </v-col>
          <v-col>
            <!-- 日付選択 -->
            <v-date-picker
              no-title
              bottom
              color="primary"
              :min="minDate"
              @change="addDate"
              :allowed-dates="
                (v) =>
                  !dates.map((d) => d.from.toFormat('yyyy-MM-dd')).includes(v)
              "
            />
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <!-- 日時選択解除 -->
        <v-list class="overflow-y-auto" max-height="75vh">
          <div v-if="dates.length === 0">Click Calendar to add date!</div>
          <date-list-item
            v-for="v in dates"
            :key="v.id"
            :date="v.from"
            :on-remove="() => removeDate(v.id)"
          />
          <!-- メソッドのPropsダウン -->
          <!-- ここでは -->
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { DateTime } from 'luxon'
import DateListItem from './DateListItem.vue'
export default {
  //modelは親に渡す値の通り道
  model: {
    prop: 'value',
    event: 'change',
  },
  // propsは親からの受け皿
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: '',
      description: '',
      time: '19:00',
      minDate: DateTime.now().toFormat('yyyy-MM-dd'),
      dates: [],
    }
  },

  methods: {
    // Watchで使用される事を想定している
    // 各@changeイベントでdateが更新されたら、Watchが監視し即座にemitする
    changeEvent() {
      this.$emit('change', {
        title: this.title,
        description: this.description,
        dates: this.dates,
      })
    },
    // 日付Pick時のイベント。引数はdate
    addDate(d) {
      const time = DateTime.fromFormat(this.time, 'HH:mm')
      const date = DateTime.fromISO(d).set({
        hour: time.hour,
        minute: time.minute,
      })
      // ...はスプレット構文：...配列名で配列の中身を展開できる
      // この場合はthis.dates配列の中に元々の値を展開し、さらに入力されたdateを定義している
      this.dates = [
        ...this.dates,
        {
          // +：値をNumber型に変換
          // idを入力時刻に設定
          id: +new Date(),
          from: date,
        },
        // イベントの設定時間順にソートしていると思われる
      ].sort((a, b) => a.from.valueOf() - b.from.valueOf())
      // this.datesの更新をwatchが監視しているので、必要ない気もする
      this.changeEvent()
    },

    removeDate(id) {
      // dates配列の中からremoveDateの引数と一致するidを持つオブジェクトを取り除く
      this.dates = this.dates.filter((d) => d.id !== id)
      this.changeEvent()
    },
  },
  watch: {
    value() {
      this.title = this.value.title
      this.description = this.value.description
    },
    // changeEventメソッドで使用されるパラメータ(title,description)の変化を監視し
    // 更新があれば、即座にchangeEvent()を発生させる
    title() {
      this.changeEvent()
    },
    description() {
      this.changeEvent()
    },
  },
  components: { DateListItem },
}
</script>

<style scoped></style>
