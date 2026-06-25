import React from 'react';

/**
 * Component phân trang dùng chung
 * @param {number} currentPage - Trang hiện tại (1-indexed)
 * @param {number} totalPages - Tổng số trang
 * @param {function} onPageChange - Callback khi đổi trang
 * @param {number} totalItems - Tổng số mục (tuỳ chọn)
 * @param {string} itemLabel - Nhãn hiển thị (mặc định "mục")
 */
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemLabel = 'mục' }) {
    if (totalPages <= 1) return null;

    // Tạo mảng số trang với logic rút gọn (hiển thị tối đa 7 nút)
    const getPageNumbers = () => {
        const pages = [];
        const delta = 2; // Số trang hiển thị xung quanh trang hiện tại

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > delta + 2) pages.push('...');
            const start = Math.max(2, currentPage - delta);
            const end = Math.min(totalPages - 1, currentPage + delta);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - delta - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div style={styles.wrapper}>
            {/* Nút Trang trước */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ ...styles.btn, ...(currentPage === 1 ? styles.btnDisabled : {}) }}
                title="Trang trước"
            >
                <i className="fas fa-chevron-left" style={{ fontSize: 11 }} />
            </button>

            {/* Các số trang */}
            {pageNumbers.map((page, index) =>
                page === '...' ? (
                    <span key={`ellipsis-${index}`} style={styles.ellipsis}>...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        style={{
                            ...styles.btn,
                            ...(page === currentPage ? styles.btnActive : {}),
                        }}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Nút Trang sau */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ ...styles.btn, ...(currentPage === totalPages ? styles.btnDisabled : {}) }}
                title="Trang sau"
            >
                <i className="fas fa-chevron-right" style={{ fontSize: 11 }} />
            </button>

            {/* Thông tin tổng */}
            {totalItems !== undefined && (
                <span style={styles.info}>
                    Trang {currentPage}/{totalPages}
                    {totalItems !== undefined && ` — ${totalItems} ${itemLabel}`}
                </span>
            )}
        </div>
    );
}

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '40px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    btn: {
        minWidth: '40px',
        height: '40px',
        padding: '0 12px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        background: '#fff',
        color: '#334155',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '14px',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnActive: {
        background: 'linear-gradient(135deg, #11CAA0, #005088)',
        color: '#fff',
        border: '2px solid transparent',
        boxShadow: '0 4px 14px rgba(17,202,160,0.35)',
        transform: 'translateY(-1px)',
    },
    btnDisabled: {
        opacity: 0.35,
        cursor: 'not-allowed',
        pointerEvents: 'none',
    },
    ellipsis: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '40px',
        height: '40px',
        color: '#94a3b8',
        fontWeight: 600,
        fontSize: '14px',
    },
    info: {
        marginLeft: '10px',
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 500,
    },
};

export default Pagination;
