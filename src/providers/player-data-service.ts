import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class PlayerDataService {
    constructor(public http: Http) {}

    public getMatchHistory(): Observable<any> {
        let baseUrl = 'http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('language', 'en_US');

        return this.http.get(baseUrl, { search: params })
            .map((res: Response) => res.json())
            .map((res) => { return res.result.heroes });
    }

    public getMatchDetails(): Observable<any> {
        let baseUrl = 'http://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1';
        let params: URLSearchParams = new URLSearchParams();
        params.set('key', '1027FC1AEF0AB63243EEA50A25AE5156');
        params.set('language', 'en_US');

        return this.http.get(baseUrl, { search: params })
            .map((res: Response) => res.json())
            .map((res) => { return res.result.items });
    }
}