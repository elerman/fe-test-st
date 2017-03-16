import Layout from '../templates/Layout.hbs'
import Navbar from '../templates/Navbar.hbs'
import {Vault} from './Vault'
import {createItem} from './Factory'
import _ from 'underscore'
import sortablejs from 'sortablejs'

export const Actions = {
    loadNavbar: () => {
        let nav = Navbar({})
        $('#nav').append(nav)
        Handlers.initNavHandlers()
    },
    loadLayout: () => {
        let layout = Layout({
            items: Vault.getItems()
        })
        $("#list")
            .empty()
            .append(layout)
        Handlers.initListHandlers()
    },
    cleanForm: () => {
        document
            .getElementsByName('create-item-form')[0]
            .reset()
        $('#image-preview').attr('src', '')
        $('#image-size-checker').attr('src', '')
    }
}

export const Handlers = {
    initListHandlers: () => {
        $(document).ready(() => {
            Handlers.ddHandler()
            Handlers.deleteHandler()
            Handlers.editHandler()
        })
    },
    initNavHandlers: () => {
        Handlers.imageHandler()
        Handlers.createHandler()
    },
    createHandler: () => {
        $('form[name="create-item-form"]').off('submit')

        $('form[name="create-item-form"]').submit((evt) => {
            evt.preventDefault()
            let desc = $('textarea#item-description').val()
            let img = Cache.currentItemImg

            const validate = (desc, img) => {
                return (desc && desc.length != 0 && img)
            }

            if (!validate(desc, img)) {
                alert("Description should contain something and also an Image is required")
                return
            }

            let item = createItem(desc, img)

            //keep same id if editing
            if (Cache.currentEdit) {
                item.id = Cache.currentEdit.id
                Vault.updateItem(item)
            } else 
                Vault.saveItem(item)

            Cache.clear()

            $('#createItem').modal('hide')
            Actions.cleanForm()
            _.defer(() => {
                Actions.loadLayout()
            })

            return
        })
    },
    imageHandler: () => {
        $('#item-image').off('change')

        $('#item-image').change((evt) => {
            var file = $('#item-image').prop('files')[0]
            var reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onload = function (e) {
                var b64 = e.target.result

                var checker = document.getElementById('image-size-checker')
                checker.onload = () => {
                    let w = checker.clientWidth
                    let h = checker.clientHeight

                    if (w > 320 || h > 320) {
                        alert("image cannot be larger than 320x320px. Please choose another one")
                        $('#item-image').val('')
                        $('#image-size-checker').attr('src', '')
                        return
                    } else {
                        $('#image-preview').attr('src', window.URL.createObjectURL(file))
                        Cache.currentItemImg = b64
                    }
                }

                $('#image-size-checker').attr('src', window.URL.createObjectURL(file))
            }
        })
    },
    ddHandler: () => {
        _.defer(() => {
            sortablejs.create(document.getElementById('itemsList'), {
                animation: 100
            });
        })
    },
    deleteHandler: () => {
        $('button.remove-item').off('click')

        $('button.remove-item').on('click', (e) => {
            let id = e
                .target
                .getAttribute('item-id')
            let items = Vault.getItems()
            items = items.filter((item) => {
                return item.id != id
            })
            Vault.saveList(items)
            Actions.loadLayout()
        })
    },
    editHandler: () => {
        $('button.edit-item').off('click')

        $('button.edit-item').on('click', (e) => {
            let id = e
                .target
                .getAttribute('item-id')
            let item = Vault.getItem(id)
            Cache.currentEdit = item
            Cache.currentItemImg = item.img
            $('#item-description').val(item.description)
            $('#image-preview').attr('src', item.img)
            $('#createItem').modal('show')
        })
    }
}

export const Cache = {
    currentItemImg: null,
    currentEdit: null,
    clear: () => {
        Cache.currentItemImg = null
        Cache.currentEdit = null
    }
}