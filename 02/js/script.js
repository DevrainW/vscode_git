
Vue.filter('date', time => moment(time).format('DD/MM/YY,HH:mm:ss'))
new Vue({
    el: "#notebook",
    data() {
        return {
            content: localStorage.getItem('content') || '你可以使用**markdown**书写！',
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            selectedId: localStorage.getItem('selected-id') || null,
        }
    },
    computed: {
        notePreview() {
            // return marked.parse(this.content)
            return this.selectedNote ? marked.parse(this.selectedNote.content) : ''
        },

        addButtonTitle() {
            return this.notes.length + '条笔记已存在～'
        },

        selectedNote() {
            return this.notes.find(note => note.id === this.selectedId);
        },

        sortedNotes() {
            return this.notes.slice().sort((a, b) => a.created - b.created).sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
        },

        linesCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },

        wordsCount() {
            if (this.selectedNote) {
                let s = this.selectedNote.content
                s = s.replace(/\n/g, ' ')
                s = s.replace(/(^\s*)|(\s*$)/gi, '')
                s = s.replace(/\s\s+/gi, '')
                return s.split(' ').length
            }
        },

        charactersCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split('').length
            }
        }



    },
    watch: {
        content: 'saveNote',
        notes: {
            handler: 'saveNotes',
            deep: true
        },
        selectedId(val) {
            localStorage.setItem('selected-id', val)
        }
    },
    methods: {
        saveNote() {
            console.log('保存笔记:', this.content);
            localStorage.setItem('新笔记', this.content)
            this.reportOperation('保存')
        },

        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes))
            console.log('笔记已存储', new Date());
        },
        reportOperation(opName) {
            console.log('新笔记已经', opName);
        },
        addNote() {
            const time = Date.now()
            const note = {
                id: String(time),
                title: '新笔记' + (this.notes.length + 1),
                content: '你好,这个笔记使用markdown脚本格式化',
                created: time,
                favorite: false,
            }
            this.notes.push(note)
        },

        removeNote() {
            console.log(this.selectedNote);
            if (this.selectedNote && confirm('是否删除笔记？')) {
                const index = this.notes.indexOf(this.selectedNote)
                console.log(index);
                if (index !== -1) {
                    this.notes.splice(index, 1)
                }
            }
        },

        selectNote(note) {
            this.selectedId = note.id
        },

        favoriteNote() {
            this.selectedNote.favorite = !this.selectedNote.favorite
        }
    },
    created() {
        this.content = localStorage.getItem('新笔记') || '本地暂无存储，请使用** markdown **编辑！'
    }

})
// console.log(Vue.version);
// const html = marked.parse('**Bold** *Italic* [link] (http//:vuejs.org/)')
// console.log(html);

// console.log('恢复笔记：', localStorage.getItem('新笔记'));