import uuidV1 from 'uuid/v1'

export const createItem = (desc, img) => {
    return {
        id: uuidV1(),
        description: desc,
        img: img
    }
}