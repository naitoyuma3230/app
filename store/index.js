import { DateTime } from 'luxon'

export const state = () => {
  return {
    isLoading: false,
    // eventIdはFireBaceのDocumentへの接続のためのID
    eventId: '',
    title: '',
    description: '',
    dates: [],
    votes: [],
  }
}

export const getters = {
  isLoading(state) {
    return state.isLoading
  },
  eventId(state) {
    return state.eventId
  },
  title(state) {
    return state.title
  },
  description(state) {
    return state.description
  },
  dates(state) {
    return state.dates
  },
  votes(state) {
    return state.votes
  },
}

export const mutations = {
  setLoadingState(state, isLoading) {
    state.isLoading = !isLoading
  },
  setEventId(state, eventId) {
    state.eventId = eventId
  },
  setTitle(state, title) {
    state.title = title
  },
  setDescription(state, description) {
    state.description = description
  },
  setDates(state, dates) {
    state.dates = dates
  },
  setVotes(state, votes) {
    state.votes = votes
  },
}

export const actions = {
  startLoading(context) {
    context.commit('setLoadingState', true)
  },
  finishLoading(context) {
    context.commit('setLoadingState', false)
  },
  // 全てのパラメータの値を空に指定してMutationを呼び出す
  clearEvent(context) {
    context.commit('setEventId', '')
    context.commit('setTitle', '')
    context.commit('setDescription', '')
    context.commit('setDates', [])
    context.commit('setVotes', [])
  },

  setEvent(context, { id, title, description, dates, votes }) {
    const event = {}
    // IDが不足していた場合拒否する (Firebaseも勝手に拒否してくれるので省略可)
    if (!id) {
      return Promise.reject(new Error('empty id'))
    }

    // eventに各パラメータをセット
    // データ型のバリデーション
    if (typeof title === 'string') {
      event.title = title
    }
    if (typeof description === 'string') {
      event.description = description
    }
    if (dates instanceof Array) {
      event.dates = dates.map((date) => ({
        ...date,
        from: date.from.toJSDate(),
      }))
    }
    if (votes instanceof Array) {
      event.votes = votes
    }

    // 作成してあるコレクションをupdateする
    return this.$fire.firestore
      .collection('events')
      .doc(id)
      .update(event)
      .then(() => {
        // &&を使用することで値がある場合のみcommitを実行する
        context.commit('setEventId', id)
        title && context.commit('setTitle', title)
        description && context.commit('setDescription', description)
        dates && context.commit('setDates', dates)
        votes && context.commit('setVotes', votes)
      })
  },
  // firebaceではデータはCollection内でそれぞれID付きのドキュメント（オブジェクト(key:value)）として管理される
  // firebase上に新しいコレクションを作成し、各パラメータをドキュメントにセット
  createEvent(_, { title, description, dates }) {
    return (
      this.$fire.firestore
        .collection('events')
        .add({
          title,
          description,
          dates: dates.map((date) => ({
            ...date,
            // アプリケーション内ではLuxonのDateTimeを使っているので、Firestoreに渡すときには標準のDateに変換しておく
            from: date.from.toJSDate(),
          })),
          votes: [],
        })
        // ここまでの返り値はドキュメント(idとデータ)
        // thenで引数で受け取る
        .then((doc) => {
          return doc.id
        })
    )
  },
  fetchEvent(context, eventId) {
    return this.$fire.firestore
      .collection('events')
      .doc(eventId)
      .get()
      .then((doc) => {
        // ドキュメントの存在確認
        if (doc.exists) {
          const event = doc.data()
          context.commit('setEventId', doc.id)
          context.commit('setTitle', event.title)
          context.commit('setDescription', event.description)
          context.commit(
            'setDates',
            event.dates.map((date) => ({
              // ...dateの中身を{}に展開した後、from要素だけDate型に更新
              ...date,
              from: DateTime.fromJSDate(date.from.toDate()),
            }))
          )
          context.commit('setVotes', event.votes)
        } else {
          throw new Error('not found')
        }
      })
  },
}

// 例としてDatesオブジェクトの内容
// 配列内にtitle,description,各候補日のオブジェクト(id,from,to)
/*
dates:Array[3]
  0:Object
    from:Object
    id:1
    to:Object
  1:Object
    from:Object
    id:2
  2:Object
    from:Object
    id:3
  description:"複数のDescriptionを"
  eventId:"eventId"
*/

// 例としてvotesオブジェクトの内容
/*
votes:Array[3]
  0:Object
    id:1
    name:"れい"
    vote:Object
      1:2
      3:1
  1:Object
    id:2
    name:"りお"
    vote:Object
      1:0
      2:0
      3:0
  2:Object
    id:3
    name:"かえで"
    vote:Object
      1:1
      2:2
      3:0
*/
