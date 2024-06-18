import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/admin/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PaintingComponent } from './components/admin/painting/painting.component';
import { HomeComponent } from './components/common/home/home.component';
import { AboutComponent } from './components/common/about/about.component';
import { SettingsComponent } from './components/admin/settings/settings.component';
import { NewsViewComponent } from './components/common/news-view/news-view.component';
import { NewsComponent } from './components/admin/news/news.component';
import { NewsViewItemComponent } from './components/common/news-view-item/news-view-item.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { GalleryComponent } from './components/common/gallery/gallery.component';
import { GalleryItemComponent } from './components/common/gallery-item/gallery-item.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "admin", component: AdminComponent, children: [
            {
                path: "login", component: LoginComponent
            },
            {
                path: "dashboard", component: DashboardComponent, canActivate: [authGuard]
            },
            {
                path: "profile", component: ProfileComponent, canActivate: [authGuard]
            },
            {
                path: "paintings", component: PaintingComponent, canActivate: [authGuard]
            },
            {
                path: "settings", component: SettingsComponent, canActivate: [authGuard]
            },
            {
                path: "news", component: NewsComponent, canActivate: [authGuard]
            }
        ],
    },
    {
        path: "", redirectTo: "home", pathMatch: "full"
    },
    {
        path: "home", component: HomeComponent
    },
    {
        path: "about", component: AboutComponent
    },
    {
        path: "gallery", component: GalleryComponent
    },
    {
        path: "news", component: NewsViewComponent
    },
    {
        path: "news/:id", component: NewsViewItemComponent
    },
    {
        path: "painting/:id", component: GalleryItemComponent
    },
];
