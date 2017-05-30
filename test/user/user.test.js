const cryptoRandomString = require('crypto-random-string');
const User = require('../../app/models/user.js');
const should = require('should');
const mongoose = require('mongoose');
const request = require('supertest');
const axios = require('axios');
require('../../app.js');

let user;
// test
describe('<Unit Test>', () => {
  describe('Model User:', () => {
    before((done) => {
      user = {
        name: getRandomString(),
        password: 'password'
      };
      done();
    });

    describe('Before Method:', () => {
      it("User without saved", async () => {
        const findPromise = () => {
          return new Promise((resolve, reject) => {
            User.findOne({name: user.name}, (err, user) => {
              resolve(user);
            });
          });
        };
        let result = await findPromise();
        should.not.exist(result);
      });
    });

    describe('User save', () => {
      it('should save without problems', async () => {
        let _user = new User(user);
        let userSaveRes;
        const savePromise = () => {
          return new Promise((resolve, reject) => {
            _user.save((err, user) => {
              userSaveRes = user;
              resolve(err);
            });
          });
        };
        const removePromise = (userSaveRes) => {
          return new Promise((resolve, reject) => {
            userSaveRes.remove((err) => {
              resolve(err);
            });
          });
        };

        const saveErr = await savePromise();
        should.not.exist(saveErr);
        const removeErr = await removePromise(userSaveRes);
        should.not.exist(removeErr);
      });

      it('should have default role', async () => {
        const _user = new User(user);

        const saveUserPromise = () => {
          return new Promise((resolve, reject) => {
            _user.save((err, userRes) => {
              resolve(userRes);
            });
          });
        };
        const removePromise = (userSaveRes) => {
          return new Promise((resolve, reject) => {
            _user.remove((err) => {
              resolve(err);
            });
          });
        };

        const saveRes = await saveUserPromise();
        saveRes.role.should.equal(0);
        await removePromise();
      });
    });

    it('it \'s just a test', (done) => {
      axios
      .get('http://localhost:3000/test')
      .then(res => {
        res.data.result.should.equal(1);
        done();
      })
      .catch(err => {
        console.log(err);
      });
    });
  });
});

function getRandomString(len) {
  if (!len) len = 16;
  return cryptoRandomString(Math.ceil(16 / 2));
};
