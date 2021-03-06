/**
 * @file store/weather/index.js
 * @author ghy
 *
 * 天气数据store
 */
import { observable, runInAction, action } from 'mobx';
import {
  fetchWeatherByIp,
  fetchWeatherByArea,
  fetchHourWeatherByArea
} from '../../api/weather';
// import { fetchLocation } from '../../api/location';
// import BaseData from '../common/base-data';

export default class Weather {
  @observable.ref
  weatherData = {}; // 天气数据

  @observable.ref
  hourWeatherData = {}; // 小时天气数据

  @observable weatherDataLoading = false; // 天气数据loading

  @observable hourWeatherDataLoading = false; // 小时天气数据loading

  /**
   * 请求查询的天气数据
   */
  @action
  fetchSearchWeather = async ({ area }) => {
    this.weatherDataLoading = true;
    const data = await fetchWeatherByArea({ area });
    if (data) {
      const { showapi_res_body: content } = data || {};
      this.getAreaidFetchHourData(content);
      runInAction('get search weatherData success', () => {
        this.weatherData = content;
        this.weatherDataLoading = false;
      });
    }
    return data;
  };

  /**
   * 处理城市id
   */
  getAreaidFetchHourData = data => {
    const { cityInfo } = data || {};
    const { c1: areaid } = cityInfo || {};
    this.fetchHourWeather({ areaid });
  };

  /**
   * 根据当前ip获取天气情况
   */
  @action
  fetchDefaultWeather = async () => {
    this.weatherDataLoading = true;
    const data = await fetchWeatherByIp();
    if (data) {
      const { showapi_res_body: content } = data || {};
      this.getAreaidFetchHourData(content);
      runInAction('get IP weatherData success', () => {
        this.weatherData = content;
        this.weatherDataLoading = false;
      });
    }
    return data;
  };

  /**
   * 根据areaid获取12个小时的天气情况
   */
  @action
  fetchHourWeather = async ({ areaid }) => {
    this.hourWeatherDataLoading = true;
    const data = await fetchHourWeatherByArea({ areaid });
    if (data) {
      runInAction('get hour weatherData success', () => {
        const { showapi_res_body: content } = data || {};
        this.hourWeatherData = content;
        this.hourWeatherDataLoading = false;
      });
    }
    return data;
  };
}
