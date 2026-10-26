import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVoiceCommand } from './commandParser';

test('parses YouTube opening and search in Hindi and English', () => {
  const res1 = parseVoiceCommand('YouTube खोल दे');
  assert.equal(res1.action, 'OPEN_APP');
  assert.equal(res1.target, 'YouTube');

  const res2 = parseVoiceCommand('YouTube पर अरिजीत सिंह के गाने चलाओ');
  assert.equal(res2.action, 'SEARCH_YOUTUBE');
  assert.ok(res2.parameter?.includes('अरिजीत सिंह'));

  const res3 = parseVoiceCommand('open youtube');
  assert.equal(res3.action, 'OPEN_APP');
  assert.equal(res3.target, 'YouTube');
});

test('parses Instagram and Reels commands in Hindi and English', () => {
  const res1 = parseVoiceCommand('Instagram Reels चलाओ');
  assert.equal(res1.action, 'OPEN_REELS');

  const res2 = parseVoiceCommand('इंस्टाग्राम खोल दे');
  assert.equal(res2.action, 'OPEN_APP');
  assert.equal(res2.target, 'Instagram');
});

test('parses Auto-scroll commands in Hindi and English', () => {
  const res1 = parseVoiceCommand('नीचे स्क्रॉल कर');
  assert.equal(res1.action, 'AUTO_SCROLL');
  assert.equal(res1.parameter, 'down');

  const res2 = parseVoiceCommand('ऊपर स्क्रॉल करो');
  assert.equal(res2.action, 'AUTO_SCROLL');
  assert.equal(res2.parameter, 'up');

  const res3 = parseVoiceCommand('scroll down');
  assert.equal(res3.action, 'AUTO_SCROLL');
});

test('parses Call contact commands in Hindi and English', () => {
  const res1 = parseVoiceCommand('अमित को कॉल कर');
  assert.equal(res1.action, 'CALL_CONTACT');
  assert.ok(res1.target?.includes('अमित'));

  const res2 = parseVoiceCommand('Call 9876543210');
  assert.equal(res2.action, 'CALL_CONTACT');
  assert.equal(res2.target, '9876543210');
});

test('parses Device hardware controls (Torch, Battery, Alarm, Camera)', () => {
  const resTorch = parseVoiceCommand('टॉर्च चालू करो');
  assert.equal(resTorch.action, 'TOGGLE_TORCH');
  assert.equal(resTorch.parameter, 'on');

  const resTorchOff = parseVoiceCommand('torch band karo');
  assert.equal(resTorchOff.action, 'TOGGLE_TORCH');
  assert.equal(resTorchOff.parameter, 'off');

  const resBattery = parseVoiceCommand('बैटरी कितनी है?');
  assert.equal(resBattery.action, 'CHECK_BATTERY');

  const resAlarm = parseVoiceCommand('10 minute ka timer lagao');
  assert.equal(resAlarm.action, 'SET_ALARM');
  assert.equal(resAlarm.parameter, '10');

  const resCamera = parseVoiceCommand('कैमरा खोलो');
  assert.equal(resCamera.action, 'TAKE_PHOTO');
});
