import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('gets text on load', async (done) => {
  const mockResponse = { message: 'Hello world!' };
  jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
    json: () => mockResponse
  }));
  const wrapper = shallow(<App />);
  const text = wrapper.find('.message').text();
  expect(global.fetch).toHaveBeenCalled();
  expect(text).toBe('Not yet available');
  process.nextTick(() => {
    expect(wrapper.state().apiMessage).toBe(mockResponse.message);
    const newText = wrapper.find('.message').text();
    expect(newText).toBe(mockResponse.message);
    done();
  })
});
