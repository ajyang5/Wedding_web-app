import * as assert from 'assert';
import { guestCount } from './WeddingMain';
import { detail } from './detail';

describe('detail', function() {
const detail1: detail = {host: "Molly", 
                    isFamily: true, 
                    restriction: "none", 
                    numGuest: "1", 
                    additionalGuest: "emily", 
                    additionalGuestRestriction: "hello"};

const detail11: detail = {host: "Molly", 
                    isFamily: true, 
                    restriction: "gbgbggg", 
                    numGuest: "1", 
                    additionalGuest: "aaa", 
                    additionalGuestRestriction: "hello"};

const detail2: detail = {host: "Molly", 
                    isFamily: true, 
                    restriction: "none", 
                    numGuest: "", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};

const detail21: detail = {host: "Molly", 
                    isFamily: true, 
                    restriction: "cadcd", 
                    numGuest: "", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};

const detail3: detail = {host: "James", 
                    isFamily: true, 
                    restriction: "none", 
                    numGuest: "0", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};

const detail31: detail = {host: "James", 
                    isFamily: true, 
                    restriction: "vfvfvf", 
                    numGuest: "0", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};

const detail4: detail = {host: "Molly", 
                    isFamily: false, 
                    restriction: "none", 
                    numGuest: "1", 
                    additionalGuest: "emily", 
                    additionalGuestRestriction: "hello"};

const detail41: detail = {host: "Molly", 
                    isFamily: false, 
                    restriction: "none", 
                    numGuest: "1", 
                    additionalGuest: "bbb", 
                    additionalGuestRestriction: "vrfrvfg"};

const detail5: detail = {host: "Molly", 
                    isFamily: false, 
                    restriction: "none", 
                    numGuest: "", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};

const detail51: detail = {host: "Molly", 
                    isFamily: false, 
                    restriction: "dcvfvf", 
                    numGuest: "", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};

const detail6: detail = {host: "James", 
                    isFamily: false, 
                    restriction: "none", 
                    numGuest: "0", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};

const detail61: detail = {host: "James", 
                    isFamily: false, 
                    restriction: "fbfbfdbg", 
                    numGuest: "0", 
                    additionalGuest: "", 
                    additionalGuestRestriction: ""};


  it('guestCount', function() {
    // 0-1-many herustic: 0 recurssion
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, -1, [["angela", detail1]]), [0, 0, 0]);
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, -1, [["angela", detail6]]), [0, 0, 0]);

    // 0-1-many herustic: 1 recurssion (branch 1)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail2]]), [1, 1, 1]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail21]]), [1, 1, 1]);

    // 0-1-many herustic: 1 recurssion (branch 2)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail1]]), [2, 0, 1]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail11]]), [2, 0, 1]);

    // 0-1-many herustic: 1 recurssion (branch 3)
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 0, [["angela", detail3]]), [1, 0, 1]);
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 0, [["angela", detail31]]), [1, 0, 1]);

    // 0-1-many herustic: 1 recurssion (branch 4)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail5]]), [1, 1, 0]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail51]]), [1, 1, 0]);

    // 0-1-many herustic: 1 recurssion (branch 5)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail4]]), [2, 0, 0]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail41]]), [2, 0, 0]);

    // 0-1-many herustic: 1 recurssion (branch 6)
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 0, [["angela", detail6]]), [1, 0, 0]);
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 0, [["angela", detail61]]), [1, 0, 0]);

    // 0-1-many herustic: 1 recurssion (branch 7)
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 0, [["angela", detail1]]), [0, 0, 0]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 0, [["angela", detail6]]), [0, 0, 0]);
    

    // 0-1-many herustic: 2+ recurssion (branch 1)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 1, [["emily", detail3], ["angela", detail2]]), [1, 1, 1]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 2, [["tommy", detail5], ["emily", detail6], ["angela", detail2]]), 
                            [2, 2, 1]);

    // 0-1-many herustic: 2+ recurssion (branch 2)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 1, [["emily", detail2], ["angela", detail1]]), [3, 1, 2]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 2, [["tommy", detail5], ["emily", detail1], ["angela", detail1]]), 
                            [5, 1, 2]);

    // 0-1-many herustic: 2+ recurssion (branch 3)
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 1, [["emily", detail2], ["angela", detail3]]), [1, 0, 1]);
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 2, [["tommy", detail6], ["emily", detail1], ["angela", detail3]]), 
                            [2, 0, 1]);

    // 0-1-many herustic: 2+ recurssion (branch 4)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 1, [["emily", detail2], ["angela", detail5]]), [2, 2, 1]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 2, [["tommy", detail6], ["emily", detail1], ["angela", detail5]]), 
                            [3, 1, 1]);

    // 0-1-many herustic: 2+ recurssion (branch 5)
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 1, [["emily", detail2], ["angela", detail4]]), [3, 1, 1]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 2, [["tommy", detail6], ["emily", detail1], ["angela", detail4]]), 
                            [4, 0, 1]);

    // 0-1-many herustic: 2+ recurssion (branch 6)
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 1, [["tommy", detail6], ["angela", detail6]]), [2, 0, 0]);
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 2, [["emily", detail2], ["emily", detail4], ["angela", detail6]]), 
                            [1, 0, 0]);

    // 0-1-many herustic: 2+ recurssion (branch 7)
    assert.deepStrictEqual(guestCount("James", 0, 0, 0, 1, [["tommy", detail6], ["angela", detail1]]), [1, 0, 0]);
    assert.deepStrictEqual(guestCount("Molly", 0, 0, 0, 2, [["emily", detail2], ["emily", detail4], ["angela", detail6]]), 
                            [3, 1, 1]);
  });
});