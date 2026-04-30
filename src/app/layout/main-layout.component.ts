import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" [opened]="sidenavOpen()" class="sidenav">
        <div class="brand">
          <div class="brand-icon"><mat-icon>business</mat-icon></div>
          <div class="brand-text">
            <span class="brand-name">HR Dashboard</span>
            <span class="brand-sub">Panel de gestión</span>
          </div>
        </div>

        <div class="nav-section-label">MENÚ</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/employees" routerLinkActive="active-link">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Empleados</span>
          </a>
        </mat-nav-list>

        <div class="sidenav-footer">
          <mat-icon>info_outline</mat-icon>
          <span>v1.0.0</span>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="app-toolbar">
          <button mat-icon-button (click)="toggleSidenav()" class="menu-btn">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-spacer"></span>
          <div class="toolbar-actions">
            <button mat-icon-button class="avatar-btn">
              <mat-icon>account_circle</mat-icon>
            </button>
            <button mat-icon-button class="logout-btn" title="Cerrar sesión" (click)="logout()">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        </mat-toolbar>
        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100vh;
      }

      .sidenav {
        width: 248px;
        display: flex;
        flex-direction: column;
      }

      /* Brand */
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px 16px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      }
      .brand-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: #1d4ed8;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        mat-icon {
          color: #fff;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
      .brand-name {
        display: block;
        font-size: 15px;
        font-weight: 700;
        color: #fff;
        line-height: 1.2;
      }
      .brand-sub {
        display: block;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 1px;
      }

      /* Nav section */
      .nav-section-label {
        padding: 20px 20px 6px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.25);
      }

      mat-nav-list {
        padding: 4px 8px !important;
      }

      /* Footer */
      .sidenav-footer {
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      /* Toolbar */
      .menu-btn {
        color: #64748b;
      }
      .avatar-btn {
        color: #64748b;
        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      /* Content */
      .content {
        padding: 28px;
        min-height: calc(100vh - 64px);
        background: #f1f5f9;
        overflow-y: auto;
      }

      @media (max-width: 600px) {
        .sidenav {
          width: 100%;
        }
        .content {
          padding: 16px;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {
  private router = inject(Router);
  sidenavOpen = signal(true);

  toggleSidenav() {
    this.sidenavOpen.update(v => !v);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}
