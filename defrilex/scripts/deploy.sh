#!/bin/bash

# Defrilex Platform Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Defrilex Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v npx &> /dev/null; then
        print_error "npx is not installed. Please install npx and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install Vercel CLI if not present
install_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
        print_success "Vercel CLI installed"
    else
        print_success "Vercel CLI is already installed"
    fi
}

# Check if user is logged in to Vercel
check_vercel_auth() {
    print_status "Checking Vercel authentication..."
    
    if ! vercel whoami &> /dev/null; then
        print_warning "You are not logged in to Vercel"
        print_status "Please log in to Vercel..."
        vercel login
    else
        print_success "You are logged in to Vercel"
    fi
}

# Install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Build the project
build_project() {
    print_status "Building the project..."
    cd apps/web
    npm run build
    cd ../..
    print_success "Project built successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Deploy with production flag
    vercel --prod
    
    print_success "Deployment completed!"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    print_warning "Please ensure your DATABASE_URL is configured in Vercel environment variables"
    print_warning "After deployment, run: npx prisma db push"
    print_warning "Or connect to your database and run the schema manually"
}

# Main deployment function
main() {
    echo "=================================================="
    echo "🎯 Defrilex Platform Deployment Script"
    echo "=================================================="
    
    check_dependencies
    install_vercel_cli
    check_vercel_auth
    install_dependencies
    build_project
    deploy_to_vercel
    setup_database
    
    echo "=================================================="
    print_success "🎉 Deployment Complete!"
    echo "=================================================="
    echo ""
    print_status "Next steps:"
    echo "1. Configure environment variables in Vercel dashboard"
    echo "2. Set up your database (see DEPLOYMENT_GUIDE.md)"
    echo "3. Run database migrations"
    echo "4. Test your deployed application"
    echo ""
    print_status "Your application should be live at the URL provided by Vercel"
    echo ""
    print_status "For detailed setup instructions, see DEPLOYMENT_GUIDE.md"
}

# Run the main function
main "$@"
