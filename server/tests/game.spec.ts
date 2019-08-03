import { expect } from 'chai';
import 'mocha';
import { Game } from '../src/model';
import { GameBuilder } from './game-builder';

describe('Game', () => {
  describe('should move ', () => {
    it('when state is valid', () => {
      const states = ['1', '2'];
      const initialScore = 9;
      const sut = new GameBuilder()
        .withRandomizer((_min: any, max: number) => max > 1 ? initialScore : 1)
        .withStates(states)
        .withPlayer('randomId1')
        .withPlayer('randomId2')
        .build();
      sut.start();
      const previousPlayer = sut.getCurrentPlayer();

      expect(sut.move(0, '1')).to.be.true;
      expect(sut.getCurrentPlayer()).to.not.be.equal(previousPlayer);
      expect(sut.getScore()).to.be.equal(3);
      expect(sut.getState()).to.be.equal(states[1]);
    });
  });

  it('should switch turns correctly ', () => {
    const states = ['1', '2', '3', '4'];
    const initialScore = 81;
    const sut = new GameBuilder()
      .withRandomizer((_min: any, max: number) => max > 1 ? initialScore : 0)
      .withStates(states)
      .withPlayer('randomId1')
      .withPlayer('randomId2')
      .build();
    sut.start();
    
    const firstPlayer = sut.getCurrentPlayer();
    expect(sut.move(0, states[0])).to.be.true;
    expect(sut.getScore()).to.be.equal(27);
    const secondPlayer = sut.getCurrentPlayer();

    expect(sut.move(0, states[1])).to.be.true;
    expect(sut.getScore()).to.be.equal(9);
    expect(sut.getCurrentPlayer()).to.be.equal(firstPlayer);

    expect(sut.move(0, states[2])).to.be.true;
    expect(sut.getScore()).to.be.equal(3);
    expect(sut.getCurrentPlayer()).to.be.equal(secondPlayer);

    expect(sut.move(0, states[3])).to.be.true;
    expect(sut.getCurrentPlayer()).to.be.equal(secondPlayer);
    expect(sut.getScore()).to.be.equal(1);
    expect(sut.getState()).to.be.equal(states[3]);
  });

  describe('should end game ', () => {
    it('when score is 1', () => {
      const states = ['1', '2'];
      const initialScore = 2;
      const sut = new GameBuilder()
        .withRandomizer((_min: any, max: number) => max > 1 ? initialScore : 1)
        .withStates(states)
        .withPlayer('randomId1')
        .withPlayer('randomId2')
        .build();
      sut.start();
      const previousPlayer = sut.getCurrentPlayer();

      const result = sut.move(1, states[0]);

      expect(result).to.be.true;
      expect(sut.getCurrentPlayer()).to.be.equal(previousPlayer);
      expect(sut.getScore()).to.be.equal(1);
      expect(sut.getState()).to.be.equal(states[0]);
      expect(sut.isOver()).to.be.true;
    });
  });

  describe('should not move ', () => {
    it('when state is invalid', () => {
      const expectedState = '1';
      const initialScore = 10;
      const sut = new GameBuilder()
        .withRandomizer((_min: any, max: number) => max > 1 ? initialScore : 1)
        .withStates(expectedState)
        .withPlayer('randomId1')
        .withPlayer('randomId2')
        .build();
      sut.start();
      const expectedCurrentPlayer = sut.getCurrentPlayer();
      const expectedScore = sut.getScore();

      expect(sut.move(1, 'not1')).to.be.false;
      expect(sut.getCurrentPlayer()).to.be.equal(expectedCurrentPlayer);
      expect(sut.getScore()).to.be.equal(expectedScore);
      expect(sut.getState()).to.be.equal(expectedState);
    });
  });

  describe('should throw exception ', () => {
    it('when try to start game with no players', () => {
      const sut = new Game(null, null);
      expect(() => sut.start()).to.throw();
    });

    it('when try to start game with insufficient players', () => {
      const sut = new GameBuilder()
        .withPlayer('randomId')
        .build();
      expect(() => sut.start()).to.throw();
    });

    it('when try to enter player in full game', () => {
      const sut = new GameBuilder()
        .withPlayer('randomId1')
        .withPlayer('randomId2')
        .build();
      expect(() => sut.enterPlayer('randomId3')).to.throw();
    });

    it('when try to move in game that is over', () => {
      const sut = new GameBuilder()
        .withRandomizer(() => 1)
        .withStates()
        .withPlayer('randomId1')
        .withPlayer('randomId2')
        .build();
      sut.start();

      expect(sut.isOver()).to.be.true;
      expect(() => sut.move(1, 'any')).to.throw();
    });

    it('when try to move in game that is full', () => {
      const sut = new GameBuilder()
        .withRandomizer((min, max) => max > 1 ? 10 : 1)
        .withStates()
        .withPlayer('randomId1')
        .withPlayer('randomId2')
        .build();
      sut.start();
      sut.removePlayer('randomId2');

      expect(sut.isOver()).to.be.false;
      expect(sut.isFull()).to.be.false;
      expect(() => sut.move(1, 'any')).to.throw();
    });
  });
});