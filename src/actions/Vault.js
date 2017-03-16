import _ from 'underscore'

export const Vault = {
    key: 'test.items',
    saveItem: (item) => {
        let items = Vault.getItems()
            ? Vault.getItems()
            : []
        items.push(item)
        localStorage.setItem(Vault.key, JSON.stringify(items))
    },
    saveList: (list) => {
        localStorage.setItem(Vault.key, JSON.stringify(list))
    },
    getItems: () => {
        return JSON.parse(localStorage.getItem(Vault.key))
    },
    getItem: (id) => {
        let items = Vault.getItems()
        return items.filter((item) => {
            return item.id == id
        })[0]
    },
    updateItem: (item)=>{
        let items = Vault.getItems()
        let indexOfUpdatedUser = _.findIndex(items, { id: item.id });
        items[indexOfUpdatedUser] = item;
        Vault.saveList(items)
    }
}