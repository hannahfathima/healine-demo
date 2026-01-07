export default class Storage {
  static retrieveItem = async (key) => {
    try {
      // console.log(key);
      return await localStorage.getItem(key);
    } catch (e) {
      console.log(e);
    }
  };

  static storeItem = async (key, value) => {
    try {
      // console.log(key, value);
      await localStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

  static clearItem = async (key) => {
    try {
      return await localStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  };
}
