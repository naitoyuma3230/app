<template>
  <v-list-item align="start">
    <v-list-item-content>
      <v-list-item-title> {{ date.toFormat('yyyy/MM/dd') }} </v-list-item-title>
      <v-list-item-subtitle>
        {{ date.toFormat('HH:mm') }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-icon color="accent" @click="onRemove()"> mdi-delete </v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
// Date型データの操作モジュール
import { DateTime } from 'luxon'
export default {
  props: {
    date: {
      type: DateTime,
      require: true,
    },
    // methodではなくpropsにonRemoveを定義し親から受け取る
    // onRemoveが発火すると親側でremoveDate(v.id)が実行される
    onRemove: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
