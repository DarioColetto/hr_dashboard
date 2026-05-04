import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

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
      <mat-sidenav
        [mode]="sidenavMode()"
        [opened]="sidenavOpen()"
        (openedChange)="sidenavOpen.set($event)"
        class="sidenav"
      >
        <div class="brand">
          <div class="brand-icon"><mat-icon>business</mat-icon></div>
          <div class="brand-text">
            <span class="brand-name">HR Dashboard</span>
            <span class="brand-sub">Panel de gestión</span>
          </div>
        </div>

        <div class="nav-section-label">MENÚ</div>
        <mat-nav-list>
          <a
            mat-list-item
            routerLink="/dashboard"
            routerLinkActive="active-link"
            (click)="onNavClick()"
          >
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a
            mat-list-item
            routerLink="/employees"
            routerLinkActive="active-link"
            (click)="onNavClick()"
          >
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

      /* Nav */
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
        background: #f1f5f9;
        box-sizing: border-box;
      }

      @media (max-width: 768px) {
        .sidenav {
          width: 260px;
        }
        .content {
          padding: 16px;
        }
      }

      @media (max-width: 480px) {
        .sidenav {
          width: 85vw;
          max-width: 300px;
        }
        .content {
          padding: 12px;
        }
      }
    `,
  ],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = signal(false);
  sidenavOpen = signal(true);
  sidenavMode = computed(() => (this.isMobile() ? 'over' : 'side') as 'over' | 'side');

  private bpSub!: Subscription;

  ngOnInit(): void {
    this.bpSub = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile.set(result.matches);
        this.sidenavOpen.set(!result.matches);
      });
  }

  ngOnDestroy(): void {
    this.bpSub.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpen.update(v => !v);
  }

  onNavClick(): void {
    if (this.isMobile()) this.sidenavOpen.set(false);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}
