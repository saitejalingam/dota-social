import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { Database } from '@ionic/cloud-angular';

import { PlayerProfile } from '../player-profile/player-profile';

import { SteamUserService } from '../../providers/steam-user-service';

@Component({
    selector: 'friends-list',
    templateUrl: 'friends-list.html'
})
export class FriendsList {
    private profile: any;
    private friends: any;
    private online: Array<any> = new Array();
    private offline: Array<any> = new Array();
    private favorites: Array<any> = new Array();

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private menuCtrl: MenuController,
        private steamUserService: SteamUserService,
        private db: Database,
        private alert: AlertController
    ) { }

    ionViewCanEnter() {
        this.profile = this.navParams.get('profile');
        this.friends = this.navParams.get('friends');
        this.sortFriends();

        this.db.collection('favorites').find({ id: this.profile.steamid }).fetch()
            .subscribe((result) => {
                let results = result ? (result.favorites || []) : [];
                this.favorites = this.friends.filter((o) => {
                    return results.find(r => r === o.steamid);
                });
            }, (err) => {
                this.alert.create({
                    title: 'API Failed',
                    message: 'Oops! Failed to fetch favorites. Please try again.',
                    buttons: ['Dismiss']
                }).present();
            }, () => {
                this.sortFriends();
                return true;
            });
    }

    private sortByState(a, b): number {
        if (a.personastate > b.personastate) { return 1; }
        if (a.personastate < b.personastate) { return -1; }
        return 0;
    }

    private sortByLastLogOff(a, b): number {
        if (a.lastlogoff < b.lastlogoff) { return 1; }
        if (a.lastlogoff > b.lastlogoff) { return -1; }
        return 0;
    }

    private sortFriends() {
        this.online = this.friends.filter(o => {
            return o.personastate !== 0 && this.favorites.findIndex(f => f.steamid === o.steamid) < 0
        }).sort(this.sortByState);
        this.offline = this.friends.filter(o => {
            return o.personastate === 0 && this.favorites.findIndex(f => f.steamid === o.steamid) < 0
        }).sort(this.sortByLastLogOff);
    }

    public updateFriends(refresher) {
        this.steamUserService.getFriendSummaries()
            .subscribe((friends) => {
                this.steamUserService.friends = friends;
                this.friends = friends;
                this.sortFriends();
                refresher.complete();
            }, (err) => {
                refresher.complete();
                this.alert.create({
                    title: 'API Failed',
                    message: 'Oops! Failed to update friends info. Please try again.',
                    buttons: ['Dismiss']
                }).present();
            });
    }

    public navigateToProfile(friend) {
        this.menuCtrl.close();
        this.nav.push(PlayerProfile, {
            player: this.profile,
            friend: friend,
            favorites: this.favorites.map((o) => { return o.steamid })
        });
    }
}