# Contributing to Rock Stock

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Rock Stock project.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow
- Report issues responsibly

## How to Contribute

### 1. Report Issues

Found a bug or have a feature request?

1. Check existing issues first to avoid duplicates
2. Provide a clear description and steps to reproduce
3. Include relevant logs and environment information
4. Use the bug/feature request templates if available

### 2. Submit Pull Requests

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make changes** with clear, atomic commits
4. **Write tests** for new features
5. **Update documentation** if needed
6. **Push** to your fork: `git push origin feature/your-feature-name`
7. **Create a Pull Request** with a descriptive title and description

### PR Guidelines

- Keep PRs focused on a single feature or bug fix
- Include tests for all new code
- Follow the existing code style
- Update relevant documentation
- Ensure all tests pass locally before submitting
- Reference related issues in the PR description

## Development Setup

### Prerequisites

- Node.js v18+
- npm v9+
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/rock-stock.git
cd rock-stock

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Development Workflow

```bash
# Terminal 1: Backend with mock mode
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Run tests
cd backend
npm test -- --watch
```

## Code Style

### TypeScript/JavaScript

- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic
- Follow existing code patterns

### Angular Components

- Use component selectors: `app-component-name`
- Keep templates clean and readable
- Use OnPush change detection when possible
- Unsubscribe in ngOnDestroy

### File Organization

```
component-name/
├── component-name.component.ts
├── component-name.component.html
└── component-name.component.css
```

## Testing Requirements

### Backend

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- rapidapi.service.test.ts
```

- Aim for >80% code coverage
- Mock external dependencies (RapidAPI, Redis)
- Test both success and error cases

### Frontend

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test -- --code-coverage
```

- Test component inputs/outputs
- Test service methods
- Mock HTTP calls

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: Add search dropdown with Material components
fix: Resolve toolbar alignment issue
docs: Update README with mock mode instructions
style: Format code to match project standards
test: Add unit tests for stock API service
chore: Update dependencies
```

Format: `<type>: <description>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting
- `test`: Adding/updating tests
- `chore`: Dependency updates, config changes

## Documentation

- Update README.md for user-facing changes
- Add inline comments for complex code
- Document new environment variables
- Update API endpoint documentation
- Keep CONTRIBUTING.md current

## API Changes

If modifying API endpoints:

1. Document the change clearly
2. Update both backend and frontend
3. Add tests for the endpoint
4. Update README with new endpoint info
5. Consider backward compatibility

## Environment Variables

If adding new environment variables:

1. Add to `.env.example` with description
2. Update documentation in README
3. Set reasonable defaults
4. Validate in `config/index.ts` (backend)
5. Update environment files (frontend)

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG (if exists)
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub Release with notes

## Common Tasks

### Adding a New API Endpoint

Backend:
1. Create route file in `src/routes/`
2. Implement handler function
3. Add to `server.ts` route registration
4. Add unit tests
5. Document in README

Frontend:
1. Add method to `stock-api.service.ts`
2. Create/update component to call service
3. Add error handling
4. Add component tests

### Adding a New Component

Frontend:
```bash
cd frontend
ng generate component components/my-component
```

1. Generate component scaffold
2. Implement template and styles
3. Create unit tests
4. Add to `app.module.ts`
5. Use in parent component

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update to latest major version
npm install package-name@latest

# Test thoroughly after updates
npm test
```

## Performance Considerations

- Use Angular's OnPush change detection
- Implement proper unsubscribe patterns
- Cache HTTP responses appropriately
- Optimize bundle size
- Use lazy loading for routes (if added)

## Security

- Never commit secrets or API keys
- Use `.env` files for sensitive data
- Validate all inputs on backend
- Use HTTPS in production
- Keep dependencies updated
- Report security issues privately

## Questions or Need Help?

- Check existing issues and discussions
- Review code comments and docs
- Ask in a GitHub issue
- Look at similar implementations

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Project README (with permission)
- Release notes (for significant contributions)

---

Thank you for making Rock Stock better! 🚀
