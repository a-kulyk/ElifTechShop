
import expect from 'chai';
import mongoose from '../libs/mongoose';
import User from '../modules/user';
describe('Database connection', () => {
    it('Connect to db', (done) => {
        let Test = mongoose.model('Test',{
            name: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        });
        let test = new Test({name: "Yo!"});
        test.save()
            .then((result) => {
                done();
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});

